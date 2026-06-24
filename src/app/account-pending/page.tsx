import Link from "next/link";

export const metadata = {
  title: "アカウント確認中 | D-lab",
};

export default function AccountPendingPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-border-hair)",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "20px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" className="font-serif-jp" style={{ fontSize: 22, fontWeight: 700 }}>
            D-<span style={{ color: "var(--color-primary)" }}>lab</span>
          </Link>
          <Link
            href="/"
            className="font-mono-jp"
            style={{ fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.18em" }}
          >
            ← BACK TO HOME
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "160px 32px 80px" }}>
        <div
          className="font-mono-jp"
          style={{
            fontSize: 11,
            color: "var(--color-primary)",
            letterSpacing: "0.3em",
            marginBottom: 16,
          }}
        >
          ACCOUNT PENDING / お申し込みの確認
        </div>
        <h1
          className="font-serif-jp"
          style={{
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 32,
          }}
        >
          ご購入の確認が
          <br />
          とれませんでした。
        </h1>

        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-hair)",
            padding: 32,
            marginBottom: 24,
            lineHeight: 1.9,
            fontSize: 15,
            color: "var(--color-text-muted)",
          }}
        >
          このアカウントには有効なプランが紐づいていません。以下をご確認ください。
          <ul style={{ marginTop: 16, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <li>
              <strong style={{ color: "var(--color-text)" }}>決済直後の場合</strong>：
              反映に数分かかることがあります。少し待ってから再度ログインしてください。
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>メールアドレス違い</strong>：
              会員登録は<strong style={{ color: "var(--color-primary)" }}>決済時と同じメールアドレス</strong>で行う必要があります。異なる場合はお問い合わせください。
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>未購入の場合</strong>：
              下記からお申し込みいただけます。
            </li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link href="/apply" className="btn btn-primary">
            プランを見る・申し込む <span className="arrow">→</span>
          </Link>
          <Link href="/login" className="btn btn-ghost">
            再ログイン
          </Link>
        </div>

        <p style={{ marginTop: 32, fontSize: 13, color: "var(--color-text-dim)" }}>
          お困りの場合は{" "}
          <a href="mailto:support@dlogicai.in" style={{ color: "var(--color-primary)" }}>
            support@dlogicai.in
          </a>{" "}
          までご連絡ください。
        </p>
      </main>
    </div>
  );
}
