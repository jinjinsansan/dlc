"""
Irodori-TTS のお試しスクリプト。

1. シンプルな日本語で Kokoro で参照音声を作成
2. Irodori HuggingFace Space で TTS 生成
3. 結果を保存
"""

from pathlib import Path
import shutil

import os
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env.local")

from gradio_client import Client, handle_file

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).parent
TEST_DIR = ROOT / "audio" / "irodori_test"
TEST_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = Path.home() / ".cache" / "hyperframes" / "tts" / "models" / "kokoro-v1.0.onnx"
VOICES_PATH = Path.home() / ".cache" / "hyperframes" / "tts" / "voices" / "voices-v1.0.bin"


def make_reference():
    """シンプルな日本語のみで参照音声を作成 (Kokoro)"""
    ref_path = TEST_DIR / "reference.wav"
    if ref_path.exists():
        print(f"Reference exists: {ref_path}")
        return ref_path

    print("Generating reference audio with Kokoro (simple Japanese)...")
    kokoro = Kokoro(str(MODEL_PATH), str(VOICES_PATH))
    text = "こんにちは。今日は良い天気ですね。これからお話を始めます。"
    samples, sr = kokoro.create(text, voice="jf_alpha", speed=1.0, lang="ja")
    sf.write(str(ref_path), samples, sr)
    print(f"  -> {ref_path} ({len(samples) / sr:.2f}s)")
    return ref_path


def test_irodori(ref_audio_path: Path):
    """Irodori-TTS を呼び出して TTS"""
    print("\nConnecting to Irodori HF Space (authenticated)...")
    hf_token = os.getenv("HF_TOKEN")
    if not hf_token:
        print("ERROR: HF_TOKEN not set in .env.local")
        return
    # gradio_client v1+ uses `token` instead of `hf_token`
    try:
        client = Client("Aratako/Irodori-TTS-500M-v2-Demo", hf_token=hf_token)
    except TypeError:
        client = Client("Aratako/Irodori-TTS-500M-v2-Demo", token=hf_token)

    # シンプルなテストテキスト (英語なし)
    test_text = "こんにちは。エーアイ ビルダーズ ラボへようこそ。今日からあなたも、コードを書かずにアプリを作る側の人間です。"

    print(f"Generating TTS for: {test_text[:50]}...")
    result = client.predict(
        text=test_text,
        uploaded_audio=handle_file(str(ref_audio_path)),
        num_steps=40,
        num_candidates=1,
        seed_raw="42",
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

    # result is tuple of 32 audio paths + log
    print(f"\nGenerated {len([r for r in result[:32] if r])} candidate(s)")
    out_path = TEST_DIR / "irodori_output.wav"

    # First candidate
    first_audio = result[0]
    print(f"\nFirst result type: {type(first_audio).__name__}")
    print(f"First result content: {repr(first_audio)[:500]}")

    # Try common dict shapes from gradio_client
    src_path = None
    if isinstance(first_audio, dict):
        src_path = (
            first_audio.get("value")  # gradio update format
            or first_audio.get("path")
            or first_audio.get("url")
            or first_audio.get("name")
        )
    elif isinstance(first_audio, str):
        src_path = first_audio
    elif isinstance(first_audio, (list, tuple)) and first_audio:
        src_path = first_audio[0] if isinstance(first_audio[0], str) else first_audio[0].get("path")

    if src_path and Path(src_path).exists():
        shutil.copy2(src_path, out_path)
        print(f"Saved: {out_path}")
    else:
        print(f"Could not extract path from: {first_audio}")

    # Print log
    log = result[-1]
    print(f"\nRun log: {log[:500] if log else '(empty)'}")


if __name__ == "__main__":
    ref = make_reference()
    test_irodori(ref)
