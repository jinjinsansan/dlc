"""
Week 1〜8 のナレーション WAV を生成する。

Kokoro-82M の 510 トークン制限を回避するため、文（。区切り）ごとに
別々に合成し、無音（200ms）を挟んで連結する。
"""

import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).parent
AUDIO_DIR = ROOT / "audio"

MODEL_PATH = Path.home() / ".cache" / "hyperframes" / "tts" / "models" / "kokoro-v1.0.onnx"
VOICES_PATH = Path.home() / ".cache" / "hyperframes" / "tts" / "voices" / "voices-v1.0.bin"

VOICE = "jf_alpha"  # Japanese female
LANG = "ja"
SPEED = 1.10  # 30秒に収まるように
SILENCE_MS = 180  # 文間の無音

assert MODEL_PATH.exists(), f"model not found: {MODEL_PATH}"
assert VOICES_PATH.exists(), f"voices not found: {VOICES_PATH}"

print("Loading Kokoro model...", flush=True)
kokoro = Kokoro(str(MODEL_PATH), str(VOICES_PATH))
print("OK", flush=True)


def split_sentences(text: str) -> list[str]:
    """。で分割し、空白要素を除外"""
    # 「」内の。は分割しないように一旦保護
    text = re.sub(r"\s+", " ", text.strip())
    parts = re.split(r"(?<=。)", text)
    return [p.strip() for p in parts if p.strip()]


def synthesize_one(text: str) -> tuple[np.ndarray, int]:
    """単一文を合成"""
    samples, sr = kokoro.create(text, voice=VOICE, speed=SPEED, lang=LANG)
    return samples, sr


def synthesize_text(text: str) -> tuple[np.ndarray, int]:
    """複数文を合成して連結"""
    sentences = split_sentences(text)
    if not sentences:
        raise ValueError("Empty text")

    chunks: list[np.ndarray] = []
    sample_rate = None

    for i, s in enumerate(sentences):
        print(f"  [{i + 1}/{len(sentences)}] {s[:30]}...", flush=True)
        samples, sr = synthesize_one(s)
        sample_rate = sr
        chunks.append(samples)
        # 無音を挟む（最後の文の後はなし）
        if i < len(sentences) - 1:
            silence = np.zeros(int(sr * SILENCE_MS / 1000), dtype=samples.dtype)
            chunks.append(silence)

    return np.concatenate(chunks), sample_rate


def main() -> None:
    weeks = sorted(AUDIO_DIR.glob("narration_week*.txt"))
    if not weeks:
        print(f"No narration files found in {AUDIO_DIR}")
        sys.exit(1)

    for txt_path in weeks:
        wav_path = txt_path.with_suffix(".wav")
        text = txt_path.read_text(encoding="utf-8").strip()
        print(f"\n=== {txt_path.name} ===", flush=True)
        try:
            audio, sr = synthesize_text(text)
            sf.write(str(wav_path), audio, sr)
            duration = len(audio) / sr
            print(f"  -> {wav_path.name}: {duration:.2f}s, sr={sr}", flush=True)
        except Exception as e:
            print(f"  ERROR: {e}", flush=True)
            raise


if __name__ == "__main__":
    main()
