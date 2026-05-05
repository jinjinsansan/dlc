"""
各 week の index.html に、シーンごとの 5 本のナレーション audio タグを
シーン開始時刻に同期して配置する。

HTML シーン構成:
  Scene 1 (0-4s)    Hook
  Scene 2 (4-9s)    Title
  Scene 3 (9-19s)   3 Steps
  Scene 4 (19-25s)  Promise
  Scene 5 (25-30s)  CTA

各 week の assets/scenes/ に s1〜s5.wav をコピーし、
data-start を視覚シーンに合わせて配置する。
"""

from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT / "audio" / "scenes"))
from scenes_data import SCENE_START_TIMES  # type: ignore

AUDIO_SCENES_DIR = ROOT / "audio" / "scenes"
WEEKS = list(range(1, 9))

# audio タグ用の安定したトラックインデックス (既存トラック 0-23 と被らないよう 30 番台)
AUDIO_TRACKS = {"s1": 30, "s2": 31, "s3": 32, "s4": 33, "s5": 34}


def build_audio_block() -> str:
    """挿入する <audio> タグ群を生成"""
    lines = ["      <!-- ═══════════ Audio: Scene-by-scene Narration ═══════════ -->"]
    for scene_key in ["s1", "s2", "s3", "s4", "s5"]:
        start = SCENE_START_TIMES[scene_key]
        # シーン尺は終了時刻まで (次シーン開始まで) で計算 - 余裕も含めて 6s 固定
        # 実際の音声は 3-7 秒なので、6s で再生中に終わる
        duration = 8  # 余裕持って 8s (実音声長を超えても問題ない)
        track = AUDIO_TRACKS[scene_key]
        lines.append(
            f'      <audio'
            f' id="narration-{scene_key}"'
            f' class="clip"'
            f' data-start="{start}"'
            f' data-duration="{duration}"'
            f' data-volume="1.0"'
            f' data-track-index="{track}"'
            f' src="assets/scenes/{scene_key}.wav"'
            f'></audio>'
        )
    lines.append("")
    return "\n".join(lines) + "\n"


def remove_existing_audio(html: str) -> str:
    """既存の audio タグ・関連コメントを全部削除 (idempotent)"""
    # コメントとそれに続く audio タグ群を削除
    html = re.sub(
        r"\n\s*<!-- ═══════════ Audio[^>]*-->\s*\n(?:\s*<audio[^>]*?(?:></audio>|>.*?</audio>)\s*\n?)+",
        "\n",
        html,
        flags=re.DOTALL,
    )
    # コメント無しの audio タグ単体も削除
    html = re.sub(
        r'\s*<audio[^>]*?id="(?:bgm|narration|narration-s\d)"[^>]*?(?:></audio>|>.*?</audio>)\s*\n?',
        "",
        html,
        flags=re.DOTALL,
    )
    # 残ったコメント行も削除
    html = re.sub(r"\s*<!-- ═══════════ Audio[^>]*-->\s*\n", "\n", html)
    return html


def update_week(week_num: int) -> None:
    week_dir = ROOT / f"week{week_num:02d}-intro"
    assert week_dir.exists(), f"missing dir: {week_dir}"

    # 1. assets/scenes/ にコピー (s1.wav ... s5.wav)
    target_scenes_dir = week_dir / "assets" / "scenes"
    # クリーンアップ
    if (week_dir / "assets" / "narration.wav").exists():
        (week_dir / "assets" / "narration.wav").unlink()
    if (week_dir / "assets" / "bgm.wav").exists():
        (week_dir / "assets" / "bgm.wav").unlink()
    target_scenes_dir.mkdir(parents=True, exist_ok=True)

    for scene_key in ["s1", "s2", "s3", "s4", "s5"]:
        src = AUDIO_SCENES_DIR / f"week{week_num:02d}_{scene_key}.wav"
        dst = target_scenes_dir / f"{scene_key}.wav"
        if not src.exists():
            print(f"  WARN: missing {src}")
            continue
        shutil.copy2(src, dst)

    # 2. index.html を更新
    index_path = week_dir / "index.html"
    html = index_path.read_text(encoding="utf-8")
    html = remove_existing_audio(html)

    audio_block = build_audio_block()

    # </div> の直前に挿入 (#root の閉じタグ・<script> の直前)
    pattern = re.compile(r'(\s+)(</div>\s*\n\s*<script>)', re.DOTALL)
    new_html, count = pattern.subn(
        f'\\1\n{audio_block}    \\2',
        html,
        count=1,
    )
    if count == 0:
        # フォールバック: 最後の </div> を探して挿入
        idx = html.rfind('</div>')
        new_html = html[:idx] + f'\n{audio_block}    ' + html[idx:]

    index_path.write_text(new_html, encoding="utf-8")
    print(f"OK: Week {week_num:02d} - 5 scene audios attached")


def main() -> None:
    for w in WEEKS:
        update_week(w)


if __name__ == "__main__":
    main()
