"""
40 本のシーン別ナレーションを Irodori で生成する。

audio/scenes/scenes_data.py の SCENES 辞書を読み、
各 (week, scene) ごとに WAV を生成して
audio/scenes/week0X_sY.wav に保存する。
"""

from __future__ import annotations

import os
import shutil
import time
import sys
from pathlib import Path

from dotenv import load_dotenv
from gradio_client import Client, handle_file

ROOT = Path(__file__).parent
load_dotenv(ROOT.parent / ".env.local")

AUDIO_DIR = ROOT / "audio"
SCENES_DIR = AUDIO_DIR / "scenes"
REF_AUDIO = AUDIO_DIR / "irodori_test" / "reference.wav"

sys.path.insert(0, str(SCENES_DIR))
from scenes_data import SCENES  # type: ignore

HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    raise SystemExit("ERROR: HF_TOKEN not set in .env.local")

assert REF_AUDIO.exists(), f"missing reference audio: {REF_AUDIO}"


def make_client() -> Client:
    try:
        return Client("Aratako/Irodori-TTS-500M-v2-Demo", hf_token=HF_TOKEN)
    except TypeError:
        return Client("Aratako/Irodori-TTS-500M-v2-Demo", token=HF_TOKEN)


def extract_path(item) -> str | None:
    if isinstance(item, dict):
        return (
            item.get("value")
            or item.get("path")
            or item.get("url")
            or item.get("name")
        )
    if isinstance(item, str):
        return item
    return None


def generate(client: Client, text: str, output_path: Path, seed: int) -> float:
    t0 = time.time()
    result = client.predict(
        text=text,
        uploaded_audio=handle_file(str(REF_AUDIO)),
        num_steps=40,
        num_candidates=1,
        seed_raw=str(seed),
        cfg_guidance_mode="independent",
        cfg_scale_text=3.0,
        cfg_scale_speaker=5.0,
        cfg_scale_raw="",
        cfg_min_t=0.5,
        cfg_max_t=1.0,
        context_kv_cache=True,
        truncation_factor_raw="",
        rescale_k_raw="",
        rescale_sigma_raw="",
        speaker_kv_scale_raw="",
        speaker_kv_min_t_raw="0.9",
        speaker_kv_max_layers_raw="",
        api_name="/gradio_inference",
    )
    elapsed = time.time() - t0
    src = extract_path(result[0])
    if not src or not Path(src).exists():
        raise RuntimeError(f"could not extract path: {result[0]!r}")
    shutil.copy2(src, output_path)
    return elapsed


def main(skip_existing: bool = False) -> None:
    print(f"Reference: {REF_AUDIO}")
    print(f"HF Token: {HF_TOKEN[:8]}... (length {len(HF_TOKEN)})")
    print(f"Scenes dir: {SCENES_DIR}")

    print("\nConnecting to Irodori HF Space (authenticated)...")
    client = make_client()
    print("Connected.\n")

    total = sum(len(scenes) for scenes in SCENES.values())
    print(f"Total: {total} scene narrations to generate.\n")

    done = 0
    for week, scenes in sorted(SCENES.items()):
        for scene_key, text in scenes.items():
            done += 1
            out_path = SCENES_DIR / f"week{week:02d}_{scene_key}.wav"
            if skip_existing and out_path.exists():
                print(f"[{done:2d}/{total}] week{week:02d}_{scene_key}: SKIP (exists)")
                continue
            seed = 42 + week * 10 + int(scene_key[1])
            print(f"[{done:2d}/{total}] week{week:02d}_{scene_key} ({len(text)} chars)...", flush=True)
            try:
                elapsed = generate(client, text, out_path, seed)
                size_kb = out_path.stat().st_size / 1024
                print(f"          -> {out_path.name} ({size_kb:.0f} KB, {elapsed:.1f}s)")
            except Exception as e:
                print(f"          ERROR: {e}")
                # Continue with the next, don't bail out
            time.sleep(1.5)

    print("\nDone.")


if __name__ == "__main__":
    main(skip_existing="--skip-existing" in sys.argv)
