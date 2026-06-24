import Link from "next/link";

/**
 * D-lab ファミリー共通ロゴ（ネイビータイル＋ゴールド輪郭D＋スワイプ ">"）。
 * D-market / D-swipe / Dlogic と同一構造で、配色のみ高級ゴールドに調和。
 *
 * フックを持たない純粋な表示コンポーネントなので、Server / Client いずれの
 * コンポーネントからも利用できる。
 */
export function DLabLogo({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="dlabLogo"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e8c96a" />
          <stop offset="1" stopColor="#c9a84c" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#0b1f3a" />
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        fill="none"
        stroke="#26324a"
        strokeWidth="1"
      />
      <path
        d="M11 13h6c4 0 7 2.8 7 7s-3 7-7 7h-6z"
        fill="none"
        stroke="url(#dlabLogo)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M25 20l6-5m-6 5l6 5"
        fill="none"
        stroke="url(#dlabLogo)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 「D-lab」ワードマーク（D- = テキスト色、lab = ゴールド） */
export function DLabWordmark({ fontSize = 22 }: { fontSize?: number }) {
  return (
    <span
      className="font-serif-jp"
      style={{
        fontSize,
        fontWeight: 700,
        letterSpacing: "0.02em",
        color: "var(--color-text)",
      }}
    >
      D-<span style={{ color: "var(--color-primary)" }}>lab</span>
    </span>
  );
}

/**
 * ロゴ＋ワードマークのセット。`href` を渡すとリンクになる。
 * `est` で "EST. 2026" ラベルの表示有無を制御。
 */
export function DLabBrand({
  href,
  size = 34,
  fontSize = 22,
  est = false,
}: {
  href?: string;
  size?: number;
  fontSize?: number;
  est?: boolean;
}) {
  const inner = (
    <>
      <DLabLogo size={size} />
      <span style={{ display: "flex", alignItems: "baseline", gap: 11 }}>
        <DLabWordmark fontSize={fontSize} />
        {est && (
          <span
            className="font-mono-jp"
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "var(--color-text-dim)",
            }}
          >
            EST. 2026
          </span>
        )}
      </span>
    </>
  );

  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 13,
    textDecoration: "none",
    flexShrink: 0,
  };

  if (href) {
    return (
      <Link href={href} style={style}>
        {inner}
      </Link>
    );
  }
  return <span style={style}>{inner}</span>;
}
