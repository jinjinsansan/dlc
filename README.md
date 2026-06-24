# AI Builders Lab

「Claude Code に日本語で指示するだけで Web サービスを作り、公開・収益化する」8週間オンライン講座の会員制サイト。

- **Framework**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth / DB / Storage**: Supabase（`@supabase/ssr`）
- **決済**: Stripe（買い切り `mode: payment`）
- **動画配信**: Cloudflare Stream（本編）/ Supabase Storage（補助）

---

## セットアップ

### 1. 依存関係

```bash
npm install
```

### 2. 環境変数（`.env.local`）

| 変数 | 用途 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Webhook 等のサーバー処理用（**公開厳禁**） |
| `STRIPE_SECRET_KEY` | Stripe シークレットキー |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 署名シークレット |
| `NEXT_PUBLIC_ADMIN_EMAIL` | 管理者メール（カンマ区切りで複数可） |

> `.env*.local` と `クラウドフレア情報.txt` は `.gitignore` 済み。本番は Vercel の環境変数に設定する。

### 3. Supabase

SQL Editor で**順番に**実行する：

1. `supabase/schema.sql` — テーブル / RLS / インデックスの基盤
2. `supabase/migrations/001_add_sort_order.sql`
3. `supabase/migrations/002_materials_full_columns.sql`
4. `supabase/migrations/003_likes_interests_jobs_sync.sql` — `post_likes` / `job_interests` / `jobs` カラム同期

> いずれも冪等（`IF NOT EXISTS` / `OR REPLACE`）で再実行しても安全。

**Storage バケット**（Private で作成）：

- `videos` — 100MB 上限
- `materials` — 50MB 上限

アクセスは API route 経由の signed URL のみ（`/api/video-url`, `/api/download`）。

### 4. Stripe Webhook

エンドポイント `/(your-domain)/api/webhook` を登録し、イベント `checkout.session.completed` を購読。署名シークレットを `STRIPE_WEBHOOK_SECRET` に設定する。

ローカル検証：

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

---

## 開発・ビルド

```bash
npm run dev     # http://localhost:3000
npm run build
npm run start
npm run lint
```

---

## アクセス制御の要点

- 決済完了 → Webhook が `users`（`email` + `plan`）を upsert。
- **会員登録は決済時と同じメールアドレスで行う必要がある**（email でプランを紐付けるため）。
  不一致 / 未課金ユーザーは `/account-pending` に誘導される。
- プラン階層 `video-only < video-email < zoom`。動画/教材/サポート/コミュニティ/受発注の
  各機能は `src/lib/plans.ts` の `PLAN_ACCESS` とサーバー側 layout ゲートで制御。
- 管理者判定は `NEXT_PUBLIC_ADMIN_EMAIL`（`src/lib/admin.ts`）。

## 申し込み受付の開閉（準備中モード）

`src/lib/siteConfig.ts` の `recruitment.isOpen` が単一の開閉スイッチ。

- `false`（準備中）: `/apply` は「準備中＋メール事前登録」を表示、LPの申込CTAは「近日公開」に変わり、
  `/api/checkout` はサーバー側で 403 を返す（API直叩きでも決済不可）。
- `true`（公開）: 申込ボタン・`/apply`・決済が一斉に有効化される。

公開するときは `isOpen: true` に変更してデプロイするだけ。事前登録メールは
`launch_emails` テーブル（migration 004）に蓄積される。
