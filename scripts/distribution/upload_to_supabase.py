"""
8 本の Week イントロ動画と 13 本の教材 PDF を Supabase にアップロードする。

事前準備:
  1. .env.local に以下を設定:
     NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=eyJ...
  2. Supabase で `videos` および `materials` バケットを作成 (Private)
  3. supabase/schema.sql を SQL Editor で実行

実行:
  pip install supabase python-dotenv
  python scripts/distribution/upload_to_supabase.py
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:
    print("ERROR: pip install python-dotenv supabase")
    sys.exit(1)

try:
    from supabase import create_client, Client
except ImportError:
    print("ERROR: pip install supabase")
    sys.exit(1)


ROOT = Path(__file__).parent.parent.parent
load_dotenv(ROOT / ".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("ERROR: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set in .env.local")
    sys.exit(1)

sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

VIDEOS_BUCKET = "videos"
MATERIALS_BUCKET = "materials"

EDU_VIDEO_DIR = ROOT / "educational-video"
PDF_DIR = ROOT / "materials" / "pdf"


# ─────────────────────────────────────────────────────────────────────────
# 動画メタデータ定義
# ─────────────────────────────────────────────────────────────────────────
VIDEO_META = {
    1: {
        "title": "Week 1 イントロ — はじめての Claude Code",
        "description": "コードを 1 行も書かずに、本物のアプリを作る。",
    },
    2: {
        "title": "Week 2 イントロ — 日本語だけで Web ページを作る",
        "description": "あなたの名前で、Web サイトを持つ。",
    },
    3: {
        "title": "Week 3 イントロ — デザインを AI に注文する",
        "description": "プロっぽい見た目を、5 分で手に入れる。",
    },
    4: {
        "title": "Week 4 イントロ — 機能を言葉で追加する",
        "description": "ただのページが、動くアプリに化ける。",
    },
    5: {
        "title": "Week 5 イントロ — AI の力をアプリに入れる",
        "description": "あなたのアプリに、AI を住まわせる。",
    },
    6: {
        "title": "Week 6 イントロ — 完成させて世界に公開する",
        "description": "あなたの URL が、世界に生まれる。",
    },
    7: {
        "title": "Week 7 イントロ — お金を受け取れるようにする",
        "description": "趣味から、ビジネスへ。一線を越える。",
    },
    8: {
        "title": "Week 8 イントロ — お客さんを集めて稼ぐ",
        "description": "最初の 1 人のお客さんと、本当に出会う。",
    },
}


def find_latest_mp4(week: int) -> Path | None:
    """指定 Week の最新 MP4 ファイルを取得"""
    renders_dir = EDU_VIDEO_DIR / f"week{week:02d}-intro" / "renders"
    if not renders_dir.exists():
        return None
    mp4s = sorted(renders_dir.glob("*.mp4"), key=lambda p: p.stat().st_mtime, reverse=True)
    return mp4s[0] if mp4s else None


def upload_videos() -> None:
    print("\n=== 動画アップロード ===")
    for week, meta in VIDEO_META.items():
        mp4 = find_latest_mp4(week)
        if not mp4:
            print(f"  Week {week:02d}: skip (MP4 not found)")
            continue

        storage_path = f"week{week:02d}/intro.mp4"
        size = mp4.stat().st_size
        print(f"  Week {week:02d}: uploading {mp4.name} ({size / 1024 / 1024:.1f} MB) -> {storage_path}")

        # アップロード（既存ファイルは上書き）
        with open(mp4, "rb") as f:
            try:
                sb.storage.from_(VIDEOS_BUCKET).upload(
                    storage_path,
                    f.read(),
                    {"content-type": "video/mp4", "upsert": "true"},
                )
            except Exception as e:
                # supabase-py v2 では upsert が別シグネチャの場合あり
                msg = str(e)
                if "Duplicate" in msg or "already exists" in msg.lower():
                    sb.storage.from_(VIDEOS_BUCKET).remove([storage_path])
                    f.seek(0)
                    sb.storage.from_(VIDEOS_BUCKET).upload(
                        storage_path,
                        f.read(),
                        {"content-type": "video/mp4"},
                    )
                else:
                    raise

        # videos テーブルへ upsert
        # 既存行を week + storage_path で検索
        existing = (
            sb.table("videos")
            .select("id")
            .eq("week", week)
            .eq("storage_path", storage_path)
            .execute()
        )

        record = {
            "week": week,
            "title": meta["title"],
            "description": meta["description"],
            "storage_path": storage_path,
            "duration_seconds": 30,
            "sort_order": 0,
            "unlocked_at": None,  # 管理画面でアンロック
        }

        if existing.data:
            sb.table("videos").update(record).eq("id", existing.data[0]["id"]).execute()
            print(f"    -> DB row updated")
        else:
            sb.table("videos").insert(record).execute()
            print(f"    -> DB row inserted")


# ─────────────────────────────────────────────────────────────────────────
# PDF メタデータ
# ─────────────────────────────────────────────────────────────────────────
PDF_META = {
    "00-README.pdf": {
        "title": "ようこそ — 教材の使い方",
        "description": "学習の進め方・カリキュラム全体像",
        "category": "reference",
        "week": None,
        "sort_order": 0,
    },
    "Week01-はじめてのClaudeCode.pdf": {
        "title": "Week 1 — はじめての Claude Code",
        "description": "インストール・最初の感動体験・上手に頼む 5 つのコツ",
        "category": "week", "week": 1, "sort_order": 1,
    },
    "Week02-日本語だけでWebページを作る.pdf": {
        "title": "Week 2 — 日本語だけで Web ページを作る",
        "description": "サイト構成テンプレ 3 種・複数ページ作成",
        "category": "week", "week": 2, "sort_order": 2,
    },
    "Week03-デザインをAIに注文する.pdf": {
        "title": "Week 3 — デザインを AI に注文する",
        "description": "プロっぽさの 4 大要素・参考サイト見せる技",
        "category": "week", "week": 3, "sort_order": 3,
    },
    "Week04-機能を言葉で追加する.pdf": {
        "title": "Week 4 — 機能を言葉で追加する",
        "description": "Supabase 導入・認証・マイページ・管理画面",
        "category": "week", "week": 4, "sort_order": 4,
    },
    "Week05-AIの力をアプリに入れる.pdf": {
        "title": "Week 5 — AI の力をアプリに入れる",
        "description": "API キー取得・AI チャット・テキスト系 AI 機能 30 選",
        "category": "week", "week": 5, "sort_order": 5,
    },
    "Week06-完成させて世界に公開する.pdf": {
        "title": "Week 6 — 完成させて世界に公開する",
        "description": "GitHub・Vercel 完全手順書・独自ドメイン",
        "category": "week", "week": 6, "sort_order": 6,
    },
    "Week07-お金を受け取れるようにする.pdf": {
        "title": "Week 7 — お金を受け取れるようにする",
        "description": "Stripe 導入・サブスク・価格設定ワークシート",
        "category": "week", "week": 7, "sort_order": 7,
    },
    "Week08-お客さんを集めて稼ぐ.pdf": {
        "title": "Week 8 — お客さんを集めて稼ぐ",
        "description": "SNS 集客・note テンプレ・最初の 1 人獲得・修了の章",
        "category": "week", "week": 8, "sort_order": 8,
    },
    "フレーズ集マスター.pdf": {
        "title": "フレーズ集マスター — 全 165+ フレーズ完全版",
        "description": "8 週間で身につけたフレーズの全集",
        "category": "phrase", "week": None, "sort_order": 0,
    },
    "トラブルシューティング.pdf": {
        "title": "トラブルシューティング — よくあるエラー 30 選",
        "description": "受講中に詰まった時の辞書",
        "category": "troubleshooting", "week": None, "sort_order": 0,
    },
    "用語集.pdf": {
        "title": "用語集 — カタカナ用語をやさしく解説",
        "description": "「○○って何?」を 30 秒で解消",
        "category": "glossary", "week": None, "sort_order": 0,
    },
    "卒業後ロードマップ.pdf": {
        "title": "卒業後ロードマップ — 6 ヶ月で月収 10〜30 万",
        "description": "受講後 6 ヶ月の具体計画",
        "category": "roadmap", "week": None, "sort_order": 0,
    },
}


def upload_pdfs() -> None:
    print("\n=== PDF アップロード ===")
    for fname, meta in PDF_META.items():
        pdf_path = PDF_DIR / fname
        if not pdf_path.exists():
            print(f"  {fname}: skip (not found)")
            continue

        storage_path = f"pdf/{fname}"
        size = pdf_path.stat().st_size
        print(f"  {fname}: uploading ({size / 1024 / 1024:.2f} MB) -> {storage_path}")

        with open(pdf_path, "rb") as f:
            try:
                sb.storage.from_(MATERIALS_BUCKET).upload(
                    storage_path,
                    f.read(),
                    {"content-type": "application/pdf", "upsert": "true"},
                )
            except Exception as e:
                msg = str(e)
                if "Duplicate" in msg or "already exists" in msg.lower():
                    sb.storage.from_(MATERIALS_BUCKET).remove([storage_path])
                    f.seek(0)
                    sb.storage.from_(MATERIALS_BUCKET).upload(
                        storage_path,
                        f.read(),
                        {"content-type": "application/pdf"},
                    )
                else:
                    raise

        # materials テーブル upsert
        existing = (
            sb.table("materials")
            .select("id")
            .eq("file_url", storage_path)
            .execute()
        )

        record = {
            "title": meta["title"],
            "description": meta["description"],
            "category": meta["category"],
            "week": meta["week"],
            "file_url": storage_path,
            "file_size_bytes": size,
            "file_type": "application/pdf",
            "sort_order": meta["sort_order"],
        }

        if existing.data:
            sb.table("materials").update(record).eq("id", existing.data[0]["id"]).execute()
            print(f"    -> DB row updated")
        else:
            sb.table("materials").insert(record).execute()
            print(f"    -> DB row inserted")


def main() -> None:
    print(f"Supabase: {SUPABASE_URL}")
    print(f"Videos source: {EDU_VIDEO_DIR}")
    print(f"PDFs source: {PDF_DIR}")

    upload_videos()
    upload_pdfs()

    print("\nDone.")


if __name__ == "__main__":
    main()
