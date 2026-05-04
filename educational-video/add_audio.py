"""
各 week のディレクトリに assets/ を作って音声ファイルを配置し、
index.html に <audio> タグを追加する。
"""

import shutil
import re
from pathlib import Path

ROOT = Path(__file__).parent
AUDIO_DIR = ROOT / "audio"

WEEKS = list(range(1, 9))


# index.html に挿入する audio スニペット
AUDIO_SNIPPET_TEMPLATE = """      <!-- ═══════════ Audio: BGM + Narration ═══════════ -->
      <audio
        id="bgm"
        class="clip"
        data-start="0"
        data-duration="30"
        data-volume="0.32"
        data-track-index="24"
        src="assets/bgm.wav"
      ></audio>
      <audio
        id="narration"
        class="clip"
        data-start="1.0"
        data-duration="29"
        data-volume="1.0"
        data-track-index="25"
        src="assets/narration.wav"
      ></audio>

"""


def update_week(week_num: int) -> None:
    week_dir = ROOT / f"week{week_num:02d}-intro"
    assert week_dir.exists(), f"missing dir: {week_dir}"

    # 1. Create assets/ and copy audio files
    assets_dir = week_dir / "assets"
    assets_dir.mkdir(exist_ok=True)

    bgm_src = AUDIO_DIR / "bgm.wav"
    narr_src = AUDIO_DIR / f"narration_week{week_num:02d}.wav"

    shutil.copy2(bgm_src, assets_dir / "bgm.wav")
    shutil.copy2(narr_src, assets_dir / "narration.wav")

    # 2. Update index.html: add audio tags before the closing </div> of root
    index_path = week_dir / "index.html"
    html = index_path.read_text(encoding="utf-8")

    # Idempotent: remove existing audio block if present
    html = re.sub(
        r"      <!-- ═══════════ Audio: BGM \+ Narration ═══════════ ═══ -->.*?</audio>\n\n",
        "",
        html,
        flags=re.DOTALL,
    )
    # Older single-line audio entries
    html = re.sub(r'\s*<audio[^>]*?id="(bgm|narration)"[^>]*?></audio>\n?', "", html)
    html = re.sub(r"      <!-- ═══════════ Audio: BGM \+ Narration ═══════════ -->\n", "", html)

    # Insert the new audio snippet just before </div> of #root
    closing_pattern = re.compile(r'(\s+)(</div>\s*\n\s*<script>)', re.DOTALL)
    new_html, count = closing_pattern.subn(
        f'\\1\n{AUDIO_SNIPPET_TEMPLATE}    \\2',
        html,
        count=1,
    )
    if count == 0:
        # Fallback: try locating the </div> closing #root by reverse search
        last_div_idx = html.rfind('</div>')
        if last_div_idx == -1:
            raise RuntimeError(f"Could not find #root </div> in {index_path}")
        # Find the </div> that closes #root (just before the <script>)
        script_idx = html.find('<script>', last_div_idx)
        # Backup approach
        new_html = html.replace(
            '</div>\n\n    <script>',
            f'\n{AUDIO_SNIPPET_TEMPLATE}    </div>\n\n    <script>',
            1,
        )

    index_path.write_text(new_html, encoding="utf-8")
    print(f"OK: Week {week_num:02d} - audio attached", flush=True)


def main() -> None:
    for w in WEEKS:
        update_week(w)


if __name__ == "__main__":
    main()
