"""
8 Week 分の intro + main = 16 本の動画を Cloudflare Stream にアップロードし、
Supabase の videos テーブルに cloudflare_video_id を保存する。

事前準備:
  1. Cloudflare Stream を有効化 (Starter Bundle / $5月)
  2. クレデンシャル
     方法 A) .env.local に以下を設定:
       CLOUDFLARE_ACCOUNT_ID=...
       CLOUDFLARE_STREAM_TOKEN=...
     方法 B) リポジトリ直下に「クラウドフレア情報.txt」を配置:
       1 行目: API トークン
       3 行目: Account ID
  3. Supabase 認証も .env.local から読む:
       NEXT_PUBLIC_SUPABASE_URL=...
       SUPABASE_SERVICE_ROLE_KEY=...
  4. supabase/schema.sql を SQL Editor で実行済みであること

実行:
  pip install requests supabase python-dotenv
  python scripts/distribution/upload_to_cloudflare_stream.py
  python scripts/distribution/upload_to_cloudflare_stream.py --force  # 既にアップ済みでも再アップ
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("ERROR: pip install requests")
    sys.exit(1)

try:
    from dotenv import load_dotenv
except ImportError:
    print("ERROR: pip install python-dotenv")
    sys.exit(1)

try:
    from supabase import create_client, Client
except ImportError:
    print("ERROR: pip install supabase")
    sys.exit(1)


ROOT = Path(__file__).parent.parent.parent
load_dotenv(ROOT / ".env.local")


# ─────────────────────────────────────────────────────────────────────────
# クレデンシャルの読み込み (.env.local 優先、なければ txt フォールバック)
# ─────────────────────────────────────────────────────────────────────────
def load_cf_credentials() -> tuple[str, str]:
    account = os.getenv("CLOUDFLARE_ACCOUNT_ID")
    token = os.getenv("CLOUDFLARE_STREAM_TOKEN")
    if account and token:
        return account, token

    txt_path = ROOT / "クラウドフレア情報.txt"
    if txt_path.exists():
        lines = [l.strip() for l in txt_path.read_text(encoding="utf-8").splitlines()]
        non_empty = [l for l in lines if l]
        if len(non_empty) >= 2:
            # 1 行目 = トークン、最後の非空行 = account id (フォーマット揺れに耐性)
            return non_empty[-1], non_empty[0]

    print("ERROR: Cloudflare credentials not found.")
    print("  .env.local に CLOUDFLARE_ACCOUNT_ID と CLOUDFLARE_STREAM_TOKEN を設定するか、")
    print("  リポジトリ直下に「クラウドフレア情報.txt」(1 行目=トークン, 3 行目=Account ID) を配置してください。")
    sys.exit(1)


CF_ACCOUNT_ID, CF_TOKEN = load_cf_credentials()
CF_API_BASE = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/stream"
CF_HEADERS = {"Authorization": f"Bearer {CF_TOKEN}"}

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("ERROR: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set in .env.local")
    sys.exit(1)

sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

EDU_VIDEO_DIR = ROOT / "educational-video"


# ─────────────────────────────────────────────────────────────────────────
# 動画メタデータ
# ─────────────────────────────────────────────────────────────────────────
VIDEO_META: dict[int, dict[str, str]] = {
    1: {
        "intro_title": "Week 1 イントロ — はじめての Claude Code",
        "intro_desc": "コードを 1 行も書かずに、本物のアプリを作る。",
        "main_title": "Week 1 本編 — はじめての Claude Code",
        "main_desc": "インストール → 対話 → メモ帳アプリ完成。30 分で「動いた」を体験する。",
    },
    2: {
        "intro_title": "Week 2 イントロ — 日本語だけで Web ページを作る",
        "intro_desc": "あなたの名前で、Web サイトを持つ。",
        "main_title": "Week 2 本編 — 日本語だけで Web ページを作る",
        "main_desc": "構成決め → AI に頼む → ページ追加 → ナビ整備。自分のサイトを 1 週間で公開。",
    },
    3: {
        "intro_title": "Week 3 イントロ — デザインを AI に注文する",
        "intro_desc": "プロっぽい見た目を、5 分で手に入れる。",
        "main_title": "Week 3 本編 — デザインを AI に注文する",
        "main_desc": "余白・配色・フォント・参考サイト引用。プロ品質に仕上げる語彙を全部覚える。",
    },
    4: {
        "intro_title": "Week 4 イントロ — 機能を言葉で追加する",
        "intro_desc": "ただのページが、動くアプリに化ける。",
        "main_title": "Week 4 本編 — 機能を言葉で追加する",
        "main_desc": "Supabase 導入・ログイン・マイページ・管理画面。Web サイトを Web アプリに進化。",
    },
    5: {
        "intro_title": "Week 5 イントロ — AI の力をアプリに入れる",
        "intro_desc": "あなたのアプリに、AI を住まわせる。",
        "main_title": "Week 5 本編 — AI の力をアプリに入れる",
        "main_desc": "API キー取得 → AI チャット実装 → 性格付け → コスト管理。差別化の最大の武器。",
    },
    6: {
        "intro_title": "Week 6 イントロ — 完成させて世界に公開する",
        "intro_desc": "あなたの URL が、世界に生まれる。",
        "main_title": "Week 6 本編 — 完成させて世界に公開する",
        "main_desc": "GitHub・Vercel デプロイ → 独自ドメイン → SEO/OGP。家族に URL を送る感動の瞬間。",
    },
    7: {
        "intro_title": "Week 7 イントロ — お金を受け取れるようにする",
        "intro_desc": "趣味から、ビジネスへ。一線を越える。",
        "main_title": "Week 7 本編 — お金を受け取れるようにする",
        "main_desc": "Stripe アカウント → 一括 / サブスク / アクセス制御 / 価格設定。起業家の入口に立つ。",
    },
    8: {
        "intro_title": "Week 8 イントロ — お客さんを集めて稼ぐ",
        "intro_desc": "最初の 1 人のお客さんと、本当に出会う。",
        "main_title": "Week 8 本編 — お客さんを集めて稼ぐ",
        "main_desc": "X / note 発信 → AI 自動投稿 → 最初の 1 人獲得 → 卒業後 6 ヶ月ロードマップ。",
    },
}

# kind ごとのデフォルト時長
DEFAULT_DURATION = {"intro": 30, "main": 300}


# ─────────────────────────────────────────────────────────────────────────
# ファイル探索 / Cloudflare API
# ─────────────────────────────────────────────────────────────────────────
def find_latest_mp4(week: int, kind: str) -> Path | None:
    renders_dir = EDU_VIDEO_DIR / f"week{week:02d}-{kind}" / "renders"
    if not renders_dir.exists():
        return None
    mp4s = sorted(renders_dir.glob("*.mp4"), key=lambda p: p.stat().st_mtime, reverse=True)
    return mp4s[0] if mp4s else None


def cf_upload(mp4: Path, name: str) -> str:
    """Cloudflare Stream に Basic Upload。成功すれば uid を返す。"""
    with open(mp4, "rb") as f:
        resp = requests.post(
            CF_API_BASE,
            headers=CF_HEADERS,
            files={"file": (mp4.name, f, "video/mp4")},
            data={"meta": json.dumps({"name": name})},
            timeout=600,
        )
    try:
        body = resp.json()
    except Exception:
        body = {"raw": resp.text[:200]}
    if not resp.ok or not body.get("success"):
        raise RuntimeError(f"Cloudflare upload failed (status={resp.status_code}): {body}")
    uid = body["result"]["uid"]
    return uid


def cf_delete(uid: str) -> None:
    resp = requests.delete(f"{CF_API_BASE}/{uid}", headers=CF_HEADERS, timeout=30)
    if not resp.ok:
        print(f"    WARN: failed to delete old CF video {uid}: {resp.status_code}")


# ─────────────────────────────────────────────────────────────────────────
# メイン処理
# ─────────────────────────────────────────────────────────────────────────
def upload_one(
    week: int,
    kind: str,
    title: str,
    description: str,
    duration_seconds: int,
    sort_order: int,
    force: bool,
) -> None:
    mp4 = find_latest_mp4(week, kind)
    if not mp4:
        print(f"  Week {week:02d} {kind}: skip (MP4 not found)")
        return

    storage_path = f"week{week:02d}/{kind}.mp4"  # 識別子としてのみ使用 (CF Stream 利用時は実体なし)

    existing = (
        sb.table("videos")
        .select("id, cloudflare_video_id")
        .eq("week", week)
        .eq("sort_order", sort_order)
        .execute()
    )
    has_existing_cf = bool(existing.data) and existing.data[0].get("cloudflare_video_id")

    if has_existing_cf and not force:
        print(f"  Week {week:02d} {kind}: skip (cloudflare_video_id exists, use --force to re-upload)")
        return

    size_mb = mp4.stat().st_size / 1024 / 1024
    print(f"  Week {week:02d} {kind}: uploading {mp4.name} ({size_mb:.1f} MB) -> CF Stream")
    uid = cf_upload(mp4, name=title)
    print(f"    -> CF uid: {uid}")

    # 既存の古い CF 動画を削除 (force 時)
    if has_existing_cf and existing.data[0]["cloudflare_video_id"] != uid:
        old_uid = existing.data[0]["cloudflare_video_id"]
        print(f"    -> deleting old CF video {old_uid}")
        cf_delete(old_uid)

    record = {
        "week": week,
        "title": title,
        "description": description,
        "storage_path": storage_path,  # 互換用 (CF 主、Supabase Storage は使わず)
        "cloudflare_video_id": uid,
        "duration_seconds": duration_seconds,
        "sort_order": sort_order,
        "unlocked_at": None,  # 管理画面でアンロック
    }

    if existing.data:
        sb.table("videos").update(record).eq("id", existing.data[0]["id"]).execute()
        print(f"    -> DB row updated")
    else:
        sb.table("videos").insert(record).execute()
        print(f"    -> DB row inserted")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="既に cloudflare_video_id がある動画も再アップ")
    parser.add_argument("--week", type=int, help="特定の week のみ処理 (1-8)")
    parser.add_argument("--kind", choices=["intro", "main"], help="intro または main のみ処理")
    args = parser.parse_args()

    print(f"Cloudflare Account: {CF_ACCOUNT_ID}")
    print(f"Supabase: {SUPABASE_URL}")
    print(f"Source: {EDU_VIDEO_DIR}")
    print(f"Force re-upload: {args.force}")

    weeks = [args.week] if args.week else list(VIDEO_META.keys())
    kinds = [args.kind] if args.kind else ["intro", "main"]

    print("\n=== Cloudflare Stream アップロード ===")
    for week in weeks:
        meta = VIDEO_META[week]
        for kind in kinds:
            sort_order = 0 if kind == "intro" else 1
            upload_one(
                week=week,
                kind=kind,
                title=meta[f"{kind}_title"],
                description=meta[f"{kind}_desc"],
                duration_seconds=DEFAULT_DURATION[kind],
                sort_order=sort_order,
                force=args.force,
            )

    print("\nDone.")


if __name__ == "__main__":
    main()
