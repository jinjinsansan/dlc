import Link from "next/link";

export default function PublicHeader() {
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
          AI Builders <span style={{ color: "var(--color-primary)" }}>Lab</span>
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
