"""
Week 3-8 本編動画を順次自動制作。

各週で実行:
  1. Irodori で音声生成
  2. recalc_timing で実音声尺に合わせて再計算
  3. HTML build
  4. assets/ に WAV コピー
  5. HyperFrames render

途中エラーが起きても、次の週に進める (resilient)。
進捗は STDOUT に出力。
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).parent
SCENES_DIR = ROOT / "audio" / "main_lesson_scenes"


def run(cmd: list[str], cwd: Path | None = None, capture: bool = False) -> tuple[int, str]:
    """サブプロセス実行 (Windows で .cmd を解決するため shell=True)"""
    print(f"  $ {' '.join(cmd)}", flush=True)
    cmd_str = " ".join(f'"{c}"' if " " in c else c for c in cmd)
    if capture:
        r = subprocess.run(cmd_str, cwd=cwd, capture_output=True, text=True, shell=True)
        return r.returncode, r.stdout + r.stderr
    r = subprocess.run(cmd_str, cwd=cwd, shell=True)
    return r.returncode, ""


def init_project(week: int) -> bool:
    """week0X-main プロジェクトディレクトリの準備"""
    target = ROOT / f"week{week:02d}-main"
    if target.exists() and (target / "package.json").exists():
        return True
    # Week 1 のテンプレートからコピー
    src = ROOT / "week01-main"
    if not src.exists():
        print(f"ERROR: source week01-main not found")
        return False
    target.mkdir(exist_ok=True)
    for f in ["hyperframes.json", "package.json", "AGENTS.md", "CLAUDE.md"]:
        if (src / f).exists():
            shutil.copy2(src / f, target / f)
    # meta.json は week 別に書き直し
    meta = {"id": f"week{week:02d}-main", "name": f"week{week:02d}-main"}
    (target / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    pkg = json.loads((src / "package.json").read_text(encoding="utf-8"))
    pkg["name"] = f"week{week:02d}-main"
    (target / "package.json").write_text(json.dumps(pkg, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  OK: initialized {target.name}")
    return True


def process_week(week: int) -> bool:
    print(f"\n{'═' * 60}")
    print(f" WEEK {week:02d} START at {time.strftime('%H:%M:%S')}")
    print(f"{'═' * 60}")

    target_dir = ROOT / f"week{week:02d}-main"

    # 0. プロジェクト初期化
    if not init_project(week):
        return False

    # 1. Irodori で音声生成
    print(f"\n[1/5] Generating audio (Irodori) for Week {week:02d}...")
    rc, _ = run(["python", "-X", "utf8", str(ROOT / "generate_main_lesson_irodori.py"), "--week", str(week), "--skip-existing"])
    if rc != 0:
        print(f"  FAIL: audio generation failed (rc={rc})")
        return False

    # 2. recalc_timing
    print(f"\n[2/5] Recalculating timing from actual audio...")
    rc, _ = run(["python", "-X", "utf8", str(ROOT / "recalc_timing.py"), "--week", str(week)])
    if rc != 0:
        print(f"  FAIL: recalc failed (rc={rc})")
        return False

    # 3. HTML build
    print(f"\n[3/5] Building HTML composition...")
    rc, _ = run(["python", "-X", "utf8", str(ROOT / "build_main_lesson_html.py"), "--week", str(week)])
    if rc != 0:
        print(f"  FAIL: HTML build failed (rc={rc})")
        return False

    # 4. Copy assets
    print(f"\n[4/5] Copying audio assets to project...")
    assets_dir = target_dir / "assets" / "main_lesson_scenes"
    assets_dir.mkdir(parents=True, exist_ok=True)
    for wav in SCENES_DIR.glob(f"week{week:02d}_*.wav"):
        shutil.copy2(wav, assets_dir / wav.name)
    print(f"  OK: copied {len(list(assets_dir.glob('*.wav')))} files")

    # 5. Clear renders + render
    print(f"\n[5/5] Rendering MP4 (this takes ~25-30 min)...")
    renders_dir = target_dir / "renders"
    if renders_dir.exists():
        shutil.rmtree(renders_dir)
    rc, _ = run(["npx", "--yes", "hyperframes@0.4.43", "render"], cwd=target_dir)
    if rc != 0:
        print(f"  FAIL: render failed (rc={rc})")
        return False

    # 確認
    mp4s = list((target_dir / "renders").glob("*.mp4"))
    if not mp4s:
        print(f"  FAIL: no MP4 produced")
        return False

    mp4 = mp4s[0]
    size_mb = mp4.stat().st_size / 1024 / 1024
    print(f"\n  ✓ DONE: {mp4.name} ({size_mb:.1f} MB)")
    print(f" WEEK {week:02d} COMPLETE at {time.strftime('%H:%M:%S')}")
    return True


def main():
    weeks = [3, 4, 5, 6, 7, 8]
    results = {}
    t0 = time.time()
    for w in weeks:
        ok = process_week(w)
        results[w] = ok
        if not ok:
            print(f"\n!! Week {w:02d} failed, continuing with next week...")

    elapsed = (time.time() - t0) / 60
    print(f"\n{'═' * 60}")
    print(f" SUMMARY (elapsed {elapsed:.1f} min)")
    print(f"{'═' * 60}")
    for w, ok in results.items():
        print(f"  Week {w:02d}: {'✓ DONE' if ok else '✗ FAILED'}")


if __name__ == "__main__":
    main()
