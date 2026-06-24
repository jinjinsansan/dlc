import Link from "next/link";

function PublicHeader() {
  return (
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
          style={{
            fontSize: 11,
            color: "var(--color-text-muted)",
            letterSpacing: "0.18em",
          }}
        >
          ← BACK TO HOME
        </Link>
      </div>
    </header>
  );
}

export default function ApplySuccessPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PublicHeader />
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "160px 32px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              border: "2px solid var(--color-primary)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-primary)",
              fontSize: 36,
              marginBottom: 32,
            }}
          >
            ✓
          </div>
          <div
            className="font-mono-jp"
            style={{
              fontSize: 11,
              color: "var(--color-primary)",
              letterSpacing: "0.3em",
              marginBottom: 16,
            }}
          >
            APPLICATION COMPLETE
          </div>
          <h1
            className="font-serif-jp"
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            ようこそ、
            <br />
            <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
              第1期生
            </span>{" "}
            へ。
          </h1>
        </div>

        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-hair)",
            padding: 40,
            marginBottom: 32,
          }}
        >
          <div
            className="font-mono-jp"
            style={{
              fontSize: 10,
              color: "var(--color-text-dim)",
              letterSpacing: "0.2em",
              marginBottom: 16,
            }}
          >
            CONFIRMATION
          </div>
          <p
            style={{
              fontSize: 15,
              color: "var(--color-text)",
              lineHeight: 1.9,
            }}
          >
            決済が正常に完了しました。
            <br />
            ご登録のメールアドレスに確認メールをお送りしました。
          </p>
        </div>

        <div
          style={{
            padding: 32,
            border: "1px solid var(--color-primary)",
            background: "rgba(201,168,76,0.04)",
            marginBottom: 48,
          }}
        >
          <div
            className="font-mono-jp"
            style={{
              fontSize: 10,
              color: "var(--color-primary)",
              letterSpacing: "0.2em",
              marginBottom: 12,
            }}
          >
            NEXT STEPS
          </div>
          <ol
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontSize: 14,
              color: "var(--color-text-muted)",
              lineHeight: 1.7,
              padding: 0,
              margin: 0,
            }}
          >
            <li>
              <span className="font-serif-jp" style={{ color: "var(--color-primary)" }}>
                01.
              </span>{" "}
              ご登録メールに領収書 PDF を送付しました
            </li>
            <li>
              <span className="font-serif-jp" style={{ color: "var(--color-primary)" }}>
                02.
              </span>{" "}
              会員登録の案内メールが届きます (数分以内)
            </li>
            <li>
              <span className="font-serif-jp" style={{ color: "var(--color-primary)" }}>
                03.
              </span>{" "}
              ログインすると会員ダッシュボードから動画・資料が見られます
            </li>
          </ol>
        </div>

        <div
          style={{
            padding: 20,
            border: "1px solid var(--color-primary)",
            background: "rgba(201,168,76,0.08)",
            marginBottom: 48,
            fontSize: 14,
            lineHeight: 1.8,
            color: "var(--color-text)",
          }}
        >
          ⚠️ <strong>重要</strong>：会員登録は必ず
          <strong style={{ color: "var(--color-primary)" }}>決済時と同じメールアドレス</strong>
          で行ってください。異なるメールアドレスで登録すると、購入したプランが反映されません。
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/login" className="btn btn-primary">
            ログインへ <span className="arrow">→</span>
          </Link>
          <Link href="/" className="btn btn-ghost">
            トップへ戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
