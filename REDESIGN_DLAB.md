# D-lab リデザイン記録

> 対象: AI Builders Lab → **D-lab** リブランド／デザイン刷新
> ブランチ: `redesign`（`origin/redesign` にpush済み）
> 実施日: 2026-06-24 / 実施者: Claude (Opus 4.8)
> 元デザイン: `DLCリデザイン.zip`（design handoff: `.dc.html` hi-fiリファレンス + SPEC.md + ロゴ/アイコン）

---

## 背景・方針

`DLCリデザイン.zip` は姉妹サービス **D-market / D-swipe / Dlogic** とブランドDNAを揃える「姉妹サイト化」ハンドオフ。
**世界観（高級ダーク・ゴールド明朝のエディトリアル）は意図的に維持**し、揃えるのは**ロゴとブランド名**のみ。

### 重要な発見
ZIP内の `src/` は**現行リポジトリのスナップショット**で、`.dc.html` はそれを基に作られたデザイン参照だった。
そのため **Hero/Pricing 等のレイアウトは既に hi-fi とほぼ一致**しており、本リデザインの主眼は
**「AI Builders Lab」→「D-lab」リブランド＋family共通ロゴ導入**となった。

### 不変の制約（すべて遵守）
1. ルーティング・APIルート（`/api/*`）は不変
2. Supabase/Stripe 呼び出し・認証フロー・ミドルウェアは不変
3. プランアクセス制御（`PLAN_ACCESS` / 各 `layout.tsx` ゲート）を維持
4. 申込開閉スイッチ `siteConfig.recruitment.isOpen` の連動を維持
5. 機能はそのまま、見た目だけ刷新
6. デザイントークンは globals.css / tailwind.config.ts に集約

---

## 実施内容（段階別）

### 段階1: ロゴ導入 + Header/Footer + Hero微調整（`60a9600`）
- **`src/components/brand/DLabMark.tsx`** 新設
  - `DLabLogo` — family共通ロゴSVG（ネイビータイル `#0b1f3a` ＋ ゴールドグラデの輪郭D ＋ スワイプ ">"）
  - `DLabWordmark` — 「D-」=テキスト色 / 「lab」=ゴールド
  - `DLabBrand` — ロゴ＋ワードマーク（`href`/`est` オプション付き、Server/Client両用）
- **Header**: ロゴ＋「D-lab」＋"EST. 2026"
- **Footer**: D-lab化 ＋ family表記「D-market · D-swipe · Dlogic ファミリー」 ＋ 著作権「D-LAB」
- **layout.tsx metadata**: `<title>`/description を D-lab に
- **HeroSection**: hi-fiに合わせ微調整（radial glow 920px/.13、上余白、タイポ clamp(52,8vw,120)、min-height 96vh 等）
  ※ 固定ヘッダー分の上余白は実アプリ仕様を優先（プロトタイプのstickyとは異なるため）
- **PricingSection**: 既存実装が hi-fi と一致のため据え置き（`enrollmentOpen` 連動を維持）

### 段階2: 全画面ワードマーク統一（`cc97f59`）
- ヘッダー/ナビのワードマーク統一:
  login / register / apply / apply-success / account-pending / launch / launch-episode /
  PublicHeader / MemberSidebar / MemberHeader
- 著作権・ラベル「AI BUILDERS LAB」→「D-LAB」
- 本文コピー（About「D-labは、」/ launch / apply / episode）
- metadata（account-pending）

### 段階3: 法務ページ事業者名（`5242812`）
- 特商法・プライバシーの販売事業者名「AI Builders Lab 運営事務局」→「**D-lab 運営事務局**」（ユーザー確認済み）

---

## デザイントークン（既存 globals.css 準拠・変更なし）

| token | hex | 用途 |
|---|---|---|
| `--color-bg` / `--color-bg-deep` | `#0a0a0f` / `#06060a` | 背景 / 深い背景 |
| `--color-surface` / `-2` | `#12121e` / `#181828` | カード面 / 補助面 |
| `--color-primary` | `#c9a84c` | ゴールド（CTA/見出しアクセント/番号） |
| `--color-primary-light` / `-dim` | `#e8c96a` / `#8a7434` | ゴールド明 / 暗 |
| `--color-text` / `-muted` / `-dim` | `#f0f0f0` / `#8888aa` / `#555571` | テキスト3階調 |
| `--color-border` / `-hair` | `#2a2a3e` / `#1c1c2c` | 罫線 / ヘアライン |

- ロゴタイルの navy `#0b1f3a` は family共通の固定値（テーマ非依存）
- フォント: 見出し=Noto Serif JP / 本文=Noto Sans JP / ラベル=JetBrains Mono

---

## 検証
- `npx tsc --noEmit` … 各段階でエラーなし
- `npx next build` … 各段階で Compiled successfully（警告ゼロ）
- ソース内「AI Builders Lab」表記の残存: **0件**（完全統一）

---

## 残課題・申し送り

- **特商法ページの連絡先メール** `info@ai-builders-lab.com（仮）` が旧ブランドのプレースホルダーのまま。
  D-lab の正式メール／ドメイン確定後に差し替え要。
- **アイコン/ファビコン**: ZIP同梱の `icon-exports/D-lab-*.png` は未適用。`app/icon.png` 等への設置は任意。
- **未着手のデザイン刷新**: 本リデザインはリブランド中心。レイアウト自体を変える場合は別途。
- マージ前に `npm run dev` での目視確認を推奨。

## マージ手順（例）
```
# PR 作成: https://github.com/jinjinsansan/dlc/pull/new/redesign
# または直接マージ
git checkout main && git merge redesign
```
