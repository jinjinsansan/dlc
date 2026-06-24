import PublicHeader from "@/components/layout/PublicHeader";

const sections: [string, string][] = [
  [
    "1. 個人情報の収集",
    "当サービスでは、サービス提供のために以下の個人情報を収集することがあります。\n・メールアドレス\n・氏名（ニックネーム）\n・決済情報（Stripe を通じて処理、当社では保持しません）\n・SNS アカウント情報（任意入力）",
  ],
  [
    "2. 個人情報の利用目的",
    "・サービスの提供・運営\n・お問い合わせへの対応\n・利用規約に違反する行為への対応\n・サービスの改善・新サービスの開発\n・重要なお知らせの通知",
  ],
  [
    "3. 第三者提供",
    "法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。ただし、以下のサービスを利用しており、各サービスのプライバシーポリシーに従い情報が取り扱われます。\n・Supabase（認証・データベース）\n・Stripe（決済処理）\n・Cloudflare（動画配信）\n・Vercel（ホスティング）",
  ],
  [
    "4. 個人情報の管理",
    "個人情報の漏洩、滅失、毀損の防止のため、適切なセキュリティ対策を講じます。パスワードはハッシュ化して保存し、決済情報は Stripe が管理します。",
  ],
  [
    "5. Cookie の使用",
    "当サービスでは、認証状態の管理およびサービス改善のために Cookie を使用します。ブラウザの設定で Cookie を無効にすることができますが、一部機能が利用できなくなる場合があります。",
  ],
  [
    "6. 個人情報の開示・訂正・削除",
    "ご本人からの個人情報の開示・訂正・削除のご依頼があった場合、本人確認の上、合理的な期間内に対応いたします。マイページから自身のプロフィール情報の変更・退会が可能です。",
  ],
  [
    "7. ポリシーの変更",
    "本ポリシーの内容は、法令等の変更やサービスの変更に伴い、予告なく変更されることがあります。変更後のプライバシーポリシーは、当ページに掲載した時点で効力を生じるものとします。",
  ],
  [
    "8. お問い合わせ",
    "個人情報の取り扱いに関するお問い合わせは、サポート窓口までご連絡ください。",
  ],
];

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PublicHeader />
      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "140px 32px 100px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            className="font-mono-jp"
            style={{
              fontSize: 11,
              color: "var(--color-primary)",
              letterSpacing: "0.3em",
              marginBottom: 16,
            }}
          >
            LEGAL · PRIVACY POLICY
          </div>
          <h1
            className="font-serif-jp"
            style={{
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            プライバシー
            <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
              ポリシー
            </span>
          </h1>
          <div
            className="font-mono-jp"
            style={{
              fontSize: 11,
              color: "var(--color-text-dim)",
              letterSpacing: "0.18em",
              marginTop: 24,
            }}
          >
            制定 2026.04.01 / 最終改定 2026.05.01
          </div>
        </div>

        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-muted)",
            lineHeight: 2,
            marginBottom: 48,
          }}
        >
          D-lab 運営事務局（以下「当社」）は、お客様の個人情報の重要性を認識し、その適正な取り扱いと保護の徹底に取り組みます。本プライバシーポリシーは、当社が運営するサービスにおける個人情報の取り扱いについて定めるものです。
        </p>

        {sections.map(([t, b], i) => (
          <section
            key={i}
            style={{
              paddingTop: 32,
              paddingBottom: 32,
              borderTop: "1px solid var(--color-border-hair)",
            }}
          >
            <h2
              className="font-serif-jp"
              style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}
            >
              {t}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-muted)",
                lineHeight: 2,
                whiteSpace: "pre-line",
              }}
            >
              {b}
            </p>
          </section>
        ))}
      </main>
    </div>
  );
}
