"""
実際の音声尺に基づいて各シーンの start/duration を再計算。
audio/main_lesson_scenes/week01_*.wav の長さを測定し、
buffer を加えた timing で week01_data.py を更新する。
"""

from __future__ import annotations

import sys
import subprocess
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT / "audio" / "main_lesson_scenes"))
from week01_data import WEEK01_MAIN_SCENES  # type: ignore

AUDIO_DIR = ROOT / "audio" / "main_lesson_scenes"
DATA_PATH = AUDIO_DIR / "week01_data.py"

BUFFER_BEFORE = 0.4  # 音声開始前の間
BUFFER_AFTER = 1.6   # 音声終了後の余韻 (次シーン遷移含む)


def get_duration(wav: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(wav)],
        capture_output=True, text=True, check=True,
    )
    return float(r.stdout.strip())


def main() -> None:
    new_scenes = []
    cursor = 0.0  # 現在の時刻

    print(f"{'scene':6s} {'audio':>7s} {'scene':>7s} {'start':>7s}")
    for sid, _old_start, _old_max, text in WEEK01_MAIN_SCENES:
        wav = AUDIO_DIR / f"week01_{sid.replace('-', '_')}.wav"
        if not wav.exists():
            print(f"  MISSING: {wav}")
            continue
        audio_dur = get_duration(wav)
        scene_dur = audio_dur + BUFFER_AFTER  # 各シーン尺
        start = cursor + BUFFER_BEFORE if sid == "O1" else cursor

        new_scenes.append((sid, round(start, 2), round(scene_dur, 2), text))
        print(f"{sid:6s} {audio_dur:6.2f}s {scene_dur:6.2f}s {start:6.2f}s")
        cursor = start + scene_dur

    total = cursor
    print(f"\nTotal: {total:.2f}s ({total / 60:.2f} min)")

    # 元データ書き換え
    lines = [
        '"""',
        "Week 1 本編動画 (10 分強) のシーン別ナレーション台本データ。",
        "",
        "(scene_id, start_time, duration, text)",
        "duration は音声長 + 余韻バッファ。",
        "",
        "GENERATED: recalc_timing.py で実際の音声長から再計算済み。",
        '"""',
        "",
        "WEEK01_MAIN_SCENES: list[tuple[str, float, float, str]] = [",
    ]
    for sid, start, dur, text in new_scenes:
        # text 中の二重引用符をエスケープ
        text_escaped = text.replace('"', '\\"')
        lines.append(f'    ("{sid}", {start}, {dur}, "{text_escaped}"),')
    lines.append("]")
    lines.append("")
    lines.append(f"assert len(WEEK01_MAIN_SCENES) == {len(new_scenes)}, f\"expected {len(new_scenes)} scenes, got {{len(WEEK01_MAIN_SCENES)}}\"")
    lines.append("")
    lines.append(f"TOTAL_DURATION = {round(total + 1, 2)}  # 全体尺 (秒)")

    DATA_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"\nUpdated: {DATA_PATH}")


if __name__ == "__main__":
    main()
