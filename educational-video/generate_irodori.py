"""
Irodori-TTS HF Space で全 8 週のナレーションを生成する。

- カタカナ化済みの audio/narration_week*.txt を入力
- 参照音声: audio/irodori_test/reference.wav (Kokoro 生成のシンプル日本語)
- 出力: audio/narration_week*.wav (上書き)
"""

from __future__ import annotations

import os
import shutil
import time
from pathlib import Path

from dotenv import load_dotenv
from gradio_client import Client, handle_file

ROOT = Path(__file__).parent
load_dotenv(ROOT.parent / ".env.local")

AUDIO_DIR = ROOT / "audio"
REF_AUDIO = AUDIO_DIR / "irodori_test" / "reference.wav"

HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    raise SystemExit("ERROR: HF_TOKEN not set in .env.local")

assert REF_AUDIO.exists(), f"missing reference audio: {REF_AUDIO}"


def make_client() -> Client:
    try:
        return Client("Aratako/Irodori-TTS-500M-v2-Demo", hf_token=HF_TOKEN)
    except TypeError:
        return Client("Aratako/Irodori-TTS-500M-v2-Demo", token=HF_TOKEN)


def extract_audio_path(result_item) -> str | None:
    """gradio_client の output から file path を取り出す"""
    if isinstance(result_item, dict):
        return (
            result_item.get("value")
            or result_item.get("path")
            or result_item.get("url")
            or result_item.get("name")
        )
    if isinstance(result_item, str):
        return result_item
    return None


def generate_one(client: Client, text: str, output_path: Path, seed: int) -> None:
    print(f"  Generating ({len(text)} chars)...", flush=True)
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

    src_path = extract_audio_path(result[0])
    if not src_path or not Path(src_path).exists():
        raise RuntimeError(f"could not extract audio path from result[0]: {result[0]!r}")

    shutil.copy2(src_path, output_path)
    size_mb = output_path.stat().st_size / 1024 / 1024
    print(f"    -> {output_path.name} ({size_mb:.2f} MB) [{elapsed:.1f}s]", flush=True)


def main() -> None:
    print(f"Reference: {REF_AUDIO}")
    print(f"HF Token: {HF_TOKEN[:8]}... (length {len(HF_TOKEN)})")

    print("\nConnecting to Irodori HF Space (authenticated)...")
    client = make_client()
    print("Connected.")

    txt_files = sorted(AUDIO_DIR.glob("narration_week*.txt"))
    if not txt_files:
        raise SystemExit(f"no narration files in {AUDIO_DIR}")

    for i, txt_path in enumerate(txt_files, start=1):
        print(f"\n=== {txt_path.name} ===", flush=True)
        text = txt_path.read_text(encoding="utf-8").strip().replace("\n", " ")
        wav_path = txt_path.with_suffix(".wav")
        # Use seed 42 + week number for variation, but reproducibility
        try:
            week_num = int("".join(c for c in txt_path.stem if c.isdigit())[:2])
        except Exception:
            week_num = i
        seed = 42 + week_num
        generate_one(client, text, wav_path, seed)
        # 軽くスロットル (Spaces への思いやり)
        time.sleep(2)

    print("\nDone.")


if __name__ == "__main__":
    main()
