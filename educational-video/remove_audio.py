"""
各 week の index.html から <audio> タグと audio 用の HTMLコメントを削除する。
add_audio.py の逆操作。

assets/ フォルダは .gitignore 対象なので残してもOKだが、
オプションで削除できる。
"""

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
WEEKS = list(range(1, 9))


def strip_audio(html: str) -> str:
    """audio ブロックを除去"""
    # コメント + 2つの<audio>タグをまとめて削除
    pattern = re.compile(
        r"\n\s*<!-- ═══════════ Audio: BGM \+ Narration ═══════════ -->.*?</audio>\s*\n\s*\n",
        flags=re.DOTALL,
    )
    new_html, count = pattern.subn("\n\n", html)
    if count == 0:
        # フォールバック: 個別の<audio>タグを除去
        new_html = re.sub(
            r'\s*<audio[^>]*?id="(bgm|narration)"[^>]*?(?:></audio>|>.*?</audio>)\s*\n',
            "",
            html,
            flags=re.DOTALL,
        )
        new_html = re.sub(
            r"\s*<!-- ═══════════ Audio: BGM \+ Narration ═══════════ -->\s*\n",
            "\n",
            new_html,
        )
    return new_html


def main(remove_assets: bool = False) -> None:
    for w in WEEKS:
        week_dir = ROOT / f"week{w:02d}-intro"
        index_path = week_dir / "index.html"

        html = index_path.read_text(encoding="utf-8")
        before_count = html.count("<audio")
        new_html = strip_audio(html)
        after_count = new_html.count("<audio")

        if before_count > after_count:
            index_path.write_text(new_html, encoding="utf-8")
            print(f"OK: Week {w:02d} - removed {before_count - after_count} audio tag(s)")
        else:
            print(f"--: Week {w:02d} - no audio tags found")

        if remove_assets:
            assets_dir = week_dir / "assets"
            if assets_dir.exists():
                shutil.rmtree(assets_dir)
                print(f"    + removed {assets_dir}")


if __name__ == "__main__":
    import sys
    main(remove_assets="--clean" in sys.argv)
