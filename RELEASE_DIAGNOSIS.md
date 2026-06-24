# リリース前 100点診断レポート

> 対象: AI Builders Lab（Next.js 14 + Supabase + Stripe + Cloudflare Stream）
> 診断日: 2026-06-24 / 診断者: Claude (Opus 4.8)
> 関連コミット: `2cd039b`, `7035bd1`, `8ad6bca`

---

## 総合スコア

| 時点 | スコア | 状態 |
|------|--------|------|
| 初回診断 | **65 / 100** | リリース不可（重大ブロッカーあり） |
| 修正後 | **約95〜100 / 100** | リリース可能水準 |

土台（設計・UI・認証基盤）は良好だったが、**課金とアカウントの連携の穴**と**未定義テーブル参照**が主なリスクだった。下記をすべて修正済み。

---

## 🔴 リリースブロッカー（修正済み）

### 1. 未定義テーブル参照 — コミュニティ/受発注が動かない
- **問題**: `post_likes` / `job_interests` がコードから参照されているのに `schema.sql` に未定義。
  さらに `jobs` テーブルがコード（`description`/`budget`/`duration`）とスキーマ（`body`/`budget_min`/`deadline`）で不一致。
- **対応**: `migrations/003_likes_interests_jobs_sync.sql` を新設し2テーブル＋RLS＋jobsカラムを補完。
  `schema.sql` も同期。新規DBでも再現可能に。
- **本番DB適用**: ✅ 完了（`Success. No rows returned`）

### 2. 教材PDFが未課金ユーザーでもDL可能（アクセス制御漏れ）
- **問題**: `/api/download` が認証チェックのみでプラン未検証。`getPlanAccess(null)` が
  `video-only` 相当を返すため、未課金登録だけで教材閲覧・DLが可能だった。
- **対応**: download API に `video-url` と同じプラン階層チェックを追加。
  `getPlanAccess(null)` を `NO_ACCESS`（全false）に変更。

### 3. 決済とアカウント作成が分離 — 紐付け保証なし
- **問題**: Stripe webhook は `users`（email+plan）を作るだけ、`/register` は auth アカウントを作るだけで、
  両者をつなぐのは email の一致のみ。不一致だと「払ったのに入れない/払わず入れる」が発生。
- **対応**:
  - `members/layout` で未課金（メール不一致含む）かつ非管理者を `/account-pending` に誘導。
  - `/account-pending` 案内ページを新設。
  - success / register に「決済時と同じメール必須」を明記。

---

## 🟠 重要（修正済み）

### 4. メンバーページのサーバー側プランゲートが弱い
- **問題**: community / jobs / support がクライアント側でリンクを隠すのみ。URL直打ちで到達可能。
- **対応**: 各ルートに server layout（`community/layout.tsx` 他）を追加し、
  `access.community` / `access.jobs` / `access.support` をサーバー側で検査してリダイレクト。
  `community_free_until`（プロモ無料枠）も尊重。

### 5. Stripe webhook の堅牢性
- **問題**: `stripe_customer_id` 未保存、再送時に `created_at` を上書き、失敗時もStripeに成功を返す。
- **対応**: `stripe_customer_id`/`name` を保存、`created_at` 上書き回避（`updated_at` のみ更新）、
  失敗時 500 で Stripe にリトライさせる（冪等upsertなので安全）。

### 6. 管理者判定が単一メール固定
- **対応**: `NEXT_PUBLIC_ADMIN_EMAIL` をカンマ区切りで複数対応（`lib/admin.ts`）。

---

## 🟡 軽微・品質（対応済み）

| 項目 | 対応 |
|------|------|
| パスワード強度が6文字のみ | 8文字以上＋英数字必須に引き上げ（`register`） |
| ビルド警告（VideoCard の useEffect 依存） | `useCallback` で解消、警告ゼロのクリーンビルドに |
| README が雛形のまま | 環境変数・マイグレーション順・Stripe/Supabase設定・準備中トグルを記載 |

---

## ⚪ 意図的に据え置いた項目

- **videos / materials の SELECT RLS（authenticated 全件可）**:
  会員ページが**ロック中動画を一覧表示する仕様**のため、RLSを厳格化すると表示が壊れる。
  実体は private バケット＋signed URL API（プラン検証済み）の二重ガードで保護されているため実害なし。
- インラインstyleの多用: 保守性の問題だがリリース前の一括リファクタは risk が高く見送り。

---

## 追加対応: 準備中モード（リリース前の申し込み停止）

コミット `8ad6bca`。`siteConfig.recruitment.isOpen` を単一スイッチに。

- `false`（準備中）: `/apply` は「準備中＋メール事前登録」、LP の申込CTAは「近日公開」、
  `/api/checkout` は **403**（API直叩きでも決済不可）。
- `true`（公開）: 申込・決済が一斉に有効化。
- 事前登録メールは `launch_emails` テーブル（`migrations/004`）に蓄積。

---

## リリース前チェックリスト（運用者が実施）

- [x] 本番Supabaseで `migrations/003` 適用
- [ ] 本番Supabaseで `migrations/004`（launch_emails）適用
- [ ] Vercel 環境変数の確認（`SUPABASE_SERVICE_ROLE_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_ADMIN_EMAIL`）
- [ ] Stripe Webhook エンドポイント（`/api/webhook`・`checkout.session.completed`）登録
- [ ] `account-pending` の問い合わせ先メールを実アドレスに差し替え
- [ ] 公開時に `siteConfig.recruitment.isOpen` を `true` に変更してデプロイ
