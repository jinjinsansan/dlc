# Supabase 配信基盤 — セットアップ手順

会員サイトで動画 (Week 1〜8 イントロ) と教材 PDF (13 本) を配布できるようにする手順です。

---

## 必要なもの

- [x] Supabase アカウント (無料プランで OK)
- [x] このリポジトリ
- [x] `.env.local` に以下の値:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [x] Python 3.10+ と pip

---

## 手順 (15-20 分)

### 1. Supabase プロジェクト作成

1. [https://supabase.com](https://supabase.com) で新規プロジェクト作成
2. 「Project Settings → API」から以下をコピーして `.env.local` に貼り付け:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ 公開禁止)

### 2. スキーマ適用

1. Supabase ダッシュボードの「SQL Editor」を開く
2. `supabase/schema.sql` の全文をコピペ
3. 「Run」を押す

→ 8 つのテーブル + RLS ポリシーが作成される。
   - users / videos / video_watches / materials / announcements / tickets / posts / replies / jobs

### 3. Storage バケット作成

ダッシュボード「Storage」→「New bucket」で以下 2 つを作成:

| Bucket 名 | 設定 |
|---|---|
| `videos` | **Private** / File size limit 100MB |
| `materials` | **Private** / File size limit 50MB |

※ Private にすることで anon key からの直接アクセスを禁止し、すべて API ルート経由の signed URL でアクセスする方式になります。

### 4. 動画と PDF をアップロード

動画と PDF を Supabase に一括アップロードします。

```bash
# 1) 依存インストール (初回のみ)
pip install supabase python-dotenv

# 2) アップロード実行
python scripts/distribution/upload_to_supabase.py
```

実行ログ:
```
=== 動画アップロード ===
  Week 01: uploading week01-intro_2026-05-04_21-09-02.mp4 (6.8 MB) -> week01/intro.mp4
    -> DB row inserted
  ...
=== PDF アップロード ===
  00-README.pdf: uploading (1.15 MB) -> pdf/00-README.pdf
    -> DB row inserted
  ...
Done.
```

このスクリプトは:
- `educational-video/week0X-intro/renders/*.mp4` の最新 1 本を `videos/week0X/intro.mp4` にアップロード
- `materials/pdf/*.pdf` を `materials/pdf/*.pdf` にアップロード
- それぞれ `videos` / `materials` テーブルに行を upsert (再実行で更新)

### 5. 動画の公開設定

スキーマでは初期状態で **`unlocked_at = NULL` (非公開)** になっています。
公開には 2 通りの方法:

#### 方法 A: 管理画面から (推奨)
1. 自分のメールで会員登録 → そのメールを `.env.local` の `NEXT_PUBLIC_ADMIN_EMAIL` に設定
2. ログイン後 `/admin/videos` で「🔒 非公開」ボタンを押すと「🔓 公開中」に切替

#### 方法 B: SQL で一括公開
Supabase の SQL Editor で:
```sql
update public.videos set unlocked_at = now();
```

### 6. テストユーザー作成

会員エリアを試すには、まず会員登録 + プラン設定が必要です。

```bash
# サイトで普通に会員登録
# /register からメール+パスワード登録

# プラン設定 (SQL Editor で)
update public.users
set plan = 'zoom'  -- video-only / video-email / zoom のいずれか
where email = 'your@email.com';
```

これで `/members/videos` から動画が、`/members/materials` から PDF がダウンロードできるようになります。

---

## 動作確認チェックリスト

- [ ] `/members/videos` で Week 1 の動画カードが見える
- [ ] 動画カードをクリックすると HTML5 プレイヤーで再生される
- [ ] 50% 視聴で「視聴済み」バッジが付く
- [ ] `/members/materials` で 13 本の PDF が表示される
- [ ] PDF の「ダウンロード」をクリックすると新規タブで開く
- [ ] 別タブからログアウト状態でアクセスすると 401 エラー

---

## トラブルシューティング

### Q. 「Invalid API key」と出る
`.env.local` の Key の前後にスペースや改行が混入していないか確認。
開発サーバーを再起動:
```bash
# Ctrl+C で止めて
npm run dev
```

### Q. アップロードが「Duplicate」エラー
スクリプトが自動で削除→再アップロードを行います。それでも失敗する場合、
Storage UI から該当ファイルを手動削除してから再実行。

### Q. 動画が再生できない (404)
- Supabase Storage に MP4 がアップロードされているか確認
- `videos.storage_path` 列の値と Storage 上のパスが一致しているか確認
- 「動画準備中」表示のままなら、`videos.storage_path` が NULL か `unlocked_at` が未来日付になっている可能性

### Q. PDF が開けない (404)
- Storage の `materials/pdf/` にファイルがあるか確認
- `materials.file_url` 列と Storage パスが一致しているか確認

### Q. RLS で読めない
スキーマ適用後に下記を確認:
```sql
-- users テーブルに自分の行があるか
select * from users where email = 'your@email.com';
```
Stripe 経由で決済すると自動で行が作られるが、テスト用は手動 INSERT が必要:
```sql
insert into users (email, plan) values ('your@email.com', 'zoom');
```

---

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│ ブラウザ (会員)                                            │
│   /members/videos → VideoCard クリック                    │
│       ↓                                                   │
│   GET /api/video-url?path=week01/intro.mp4               │
│       ↓                                                   │
│   認証 + プラン照合 + Signed URL 発行                      │
│       ↓                                                   │
│   <video src={signedUrl}> で再生                          │
│                                                           │
│   /members/materials → ダウンロードボタン                  │
│       ↓                                                   │
│   GET /api/download?path=pdf/Week01.pdf                  │
│       ↓                                                   │
│   認証 → Signed URL リダイレクト                           │
└─────────────────────────────────────────────────────────┘

Supabase
├── Database (Postgres)
│   ├── videos (storage_path, plan_required, unlocked_at)
│   ├── materials (file_url, plan_required)
│   ├── video_watches (視聴済み記録)
│   └── users (プラン)
└── Storage (Private buckets)
    ├── videos/week01/intro.mp4
    │   ...
    └── materials/pdf/Week01.pdf
        ...
```

---

## コスト目安 (Supabase Free Tier)

| リソース | 上限 | 現状の使用量 |
|---|---|---|
| Database 容量 | 500MB | < 10MB |
| Storage 容量 | 1GB | 動画 ~55MB + PDF ~23MB = **~80MB** |
| Storage 帯域 | 2GB/月 | 動画視聴 100 回 (約 5.5GB) で超過の可能性 |
| Auth ユーザー | 50,000 | OK |

帯域が問題になる規模 (月 100+ 視聴) になったら、動画だけ **Cloudflare Stream** ($5/月から、HLS 適応ストリーミング、帯域実質無料) に移行を検討。
