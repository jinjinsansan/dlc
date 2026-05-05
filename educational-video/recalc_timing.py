"""
実際の音声尺に基づいて各シーンの start/duration を再計算 (--week 引数対応)。

Usage:
  python recalc_timing.py --week 1
  python recalc_timing.py --week 2
"""

from __future__ import annotations

import argparse
import importlib
import sys
import subprocess
from pathlib import Path

ROOT = Path(__file__).parent
SCENES_DIR = ROOT / "audio" / "main_lesson_scenes"
sys.path.insert(0, str(SCENES_DIR))

BUFFER_BEFORE = 0.4
BUFFER_AFTER = 1.6


def get_duration(wav: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(wav)],
        capture_output=True, text=True, check=True,
    )
    return float(r.stdout.strip())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--week", type=int, required=True)
    args = parser.parse_args()

    week = args.week
    data_module = importlib.import_module(f"week{week:02d}_data")
    var_name = f"WEEK{week:02d}_MAIN_SCENES"
    scenes = getattr(data_module, var_name)
    data_path = SCENES_DIR / f"week{week:02d}_data.py"

    new_scenes = []
    cursor = 0.0

    print(f"Week {week:02d} timing recalc")
    print(f"{'scene':6s} {'audio':>7s} {'scene':>7s} {'start':>7s}")
    for sid, _old_start, _old_max, text in scenes:
        wav = SCENES_DIR / f"week{week:02d}_{sid.replace('-', '_')}.wav"
        if not wav.exists():
            print(f"  MISSING: {wav}")
            continue
        audio_dur = get_duration(wav)
        scene_dur = audio_dur + BUFFER_AFTER
        start = cursor + BUFFER_BEFORE if sid == "O1" else cursor
        new_scenes.append((sid, round(start, 2), round(scene_dur, 2), text))
        print(f"{sid:6s} {audio_dur:6.2f}s {scene_dur:6.2f}s {start:6.2f}s")
        cursor = start + scene_dur

    total = cursor
    print(f"\nTotal: {total:.2f}s ({total / 60:.2f} min)")

    lines = [
        '"""',
        f"Week {week} 本編動画のシーン別ナレーション台本データ。",
        "",
        "(scene_id, start_time, duration, text)",
        "duration は音声長 + 余韻バッファ。",
        "",
        "GENERATED: recalc_timing.py で実際の音声長から再計算済み。",
        '"""',
        "",
        f"WEEK{week:02d}_MAIN_SCENES: list[tuple[str, float, float, str]] = [",
    ]
    for sid, start, dur, text in new_scenes:
        text_escaped = text.replace('"', '\\"')
        lines.append(f'    ("{sid}", {start}, {dur}, "{text_escaped}"),')
    lines.append("]")
    lines.append("")
    lines.append(f"assert len(WEEK{week:02d}_MAIN_SCENES) == {len(new_scenes)}, f\"expected {len(new_scenes)} scenes, got {{len(WEEK{week:02d}_MAIN_SCENES)}}\"")
    lines.append("")
    lines.append(f"TOTAL_DURATION = {round(total + 1, 2)}  # 全体尺 (秒)")

    data_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"\nUpdated: {data_path}")


if __name__ == "__main__":
    main()
