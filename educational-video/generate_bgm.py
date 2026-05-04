"""
30秒のアンビエントBGMを生成する。

スタイル: プレミアム/教育向け・低音ドローン中心・ナレーションに干渉しない
構成: ベース + パッド + 倍音シマー + フェード+空間感
"""

from pathlib import Path
import numpy as np
import soundfile as sf

ROOT = Path(__file__).parent
OUT_PATH = ROOT / "audio" / "bgm.wav"

DURATION = 30.0  # 秒
SAMPLE_RATE = 24000

# C minor 系の落ち着いた響き（黒×ゴールドの世界観に合わせ）
# C2 (65.41Hz), G2 (98Hz), Eb3 (155.56Hz), G3 (196Hz), Bb3 (233.08Hz)
ROOT_FREQ = 65.41   # C2 - 低音ドローン
FIFTH_FREQ = 98.0   # G2 - 5度
MID_FREQ = 155.56   # Eb3 - 短3度（陰影を出す）
HIGH_FREQ = 196.0   # G3 - 1オクターブ上の5度
SHIMMER_FREQ = 392.0  # G4 - シマー高音


def make_sine(freq: float, duration: float, sample_rate: int = SAMPLE_RATE,
              vibrato_rate: float = 0.0, vibrato_depth: float = 0.0) -> np.ndarray:
    """ビブラート付きサイン波"""
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    if vibrato_rate > 0:
        # FMで微妙な揺らぎ
        modulator = vibrato_depth * np.sin(2 * np.pi * vibrato_rate * t)
        phase = 2 * np.pi * freq * t + modulator
    else:
        phase = 2 * np.pi * freq * t
    return np.sin(phase)


def adsr(samples: np.ndarray, attack: float, release: float,
         sample_rate: int = SAMPLE_RATE) -> np.ndarray:
    """シンプルなアタック/リリースエンベロープ"""
    n = len(samples)
    env = np.ones(n)
    a_samples = int(sample_rate * attack)
    r_samples = int(sample_rate * release)
    if a_samples > 0:
        env[:a_samples] = np.linspace(0, 1, a_samples)
    if r_samples > 0:
        env[-r_samples:] = np.linspace(1, 0, r_samples)
    return samples * env


def soft_clip(samples: np.ndarray, threshold: float = 0.85) -> np.ndarray:
    """ソフトクリッピングで歪みを抑える"""
    return np.tanh(samples / threshold) * threshold


def slow_swell(duration: float, freq: float = 0.07,
               sample_rate: int = SAMPLE_RATE) -> np.ndarray:
    """超低速のうねり（呼吸感）"""
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    # 0.5 〜 1.0 の範囲でゆっくり振れる
    return 0.75 + 0.25 * np.sin(2 * np.pi * freq * t)


def main() -> None:
    print("Generating BGM...", flush=True)

    # ── レイヤー構成 ──
    # 1. ルートドローン (C2) - 中心の重み
    bass = make_sine(ROOT_FREQ, DURATION, vibrato_rate=0.3, vibrato_depth=0.04) * 0.30
    bass += make_sine(ROOT_FREQ * 2, DURATION, vibrato_rate=0.2, vibrato_depth=0.02) * 0.10  # オクターブ上で厚み

    # 2. 5度のパッド (G2) - 安定感
    fifth = make_sine(FIFTH_FREQ, DURATION, vibrato_rate=0.4, vibrato_depth=0.03) * 0.18

    # 3. 短3度 (Eb3) - 陰影
    mid = make_sine(MID_FREQ, DURATION, vibrato_rate=0.5, vibrato_depth=0.05) * 0.12

    # 4. 上の5度 (G3) - 広がり
    high = make_sine(HIGH_FREQ, DURATION, vibrato_rate=0.7, vibrato_depth=0.08) * 0.08

    # 5. シマー (G4) - キラリと光る
    shimmer = make_sine(SHIMMER_FREQ, DURATION, vibrato_rate=1.2, vibrato_depth=0.15) * 0.04

    # 重ね合わせ
    mix = bass + fifth + mid + high + shimmer

    # 全体のうねり（呼吸感）
    swell = slow_swell(DURATION)
    mix = mix * swell

    # ソフトクリップ
    mix = soft_clip(mix, threshold=0.7)

    # アタック/リリース
    mix = adsr(mix, attack=2.0, release=4.0)

    # 全体の音量を控えめに（ナレーションの邪魔にならない）
    mix = mix * 0.45

    # ステレオ化（左右で僅かにディチューンするとエアー感が出る）
    bass_r = make_sine(ROOT_FREQ * 1.003, DURATION, vibrato_rate=0.25, vibrato_depth=0.03) * 0.30
    bass_r += make_sine(ROOT_FREQ * 2 * 1.003, DURATION, vibrato_rate=0.2, vibrato_depth=0.02) * 0.10
    fifth_r = make_sine(FIFTH_FREQ * 0.997, DURATION, vibrato_rate=0.4, vibrato_depth=0.03) * 0.18
    mid_r = make_sine(MID_FREQ * 1.005, DURATION, vibrato_rate=0.5, vibrato_depth=0.05) * 0.12
    high_r = make_sine(HIGH_FREQ * 0.995, DURATION, vibrato_rate=0.7, vibrato_depth=0.08) * 0.08
    shimmer_r = make_sine(SHIMMER_FREQ * 1.007, DURATION, vibrato_rate=1.2, vibrato_depth=0.15) * 0.04

    mix_r = bass_r + fifth_r + mid_r + high_r + shimmer_r
    mix_r = mix_r * swell
    mix_r = soft_clip(mix_r, threshold=0.7)
    mix_r = adsr(mix_r, attack=2.0, release=4.0) * 0.45

    stereo = np.column_stack([mix, mix_r]).astype(np.float32)

    sf.write(str(OUT_PATH), stereo, SAMPLE_RATE)

    duration = len(stereo) / SAMPLE_RATE
    print(f"OK -> {OUT_PATH.name}: {duration:.2f}s, stereo, sr={SAMPLE_RATE}", flush=True)


if __name__ == "__main__":
    main()
