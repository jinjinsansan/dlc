import SectionHead from "./SectionHead";

export default function EraChangeSection() {
  const before = [
    "プログラミング言語の習得に1〜2年",
    "エンジニアを雇うと月100万円〜",
    "デザイナー、インフラ、別途必要",
    "完成まで半年〜1年が当たり前",
  ];
  const now = [
    "日本語でAIに話しかけるだけ",
    "初期費用 月¥3,000のAIサブスクのみ",
    "デザインも実装もAIが代行",
    "最短で1日、長くて2週間で完成",
  ];

  return (
    <section
      id="about"
      style={{
        padding: "160px 48px",
        borderBottom: "1px solid var(--color-border-hair)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead
          num="01"
          kicker="THE TURNING POINT"
          title={
            <>
              個人開発の常識は、
              <br />
              <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
                静かに、しかし完全に
              </span>
              、置き換わった。
            </>
          }
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr",
            gap: 0,
            alignItems: "stretch",
          }}
        >
          {/* Then */}
          <div style={{ paddingRight: 64 }}>
            <div
              className="font-mono-jp"
              style={{
                fontSize: 11,
                color: "var(--color-text-dim)",
                letterSpacing: "0.2em",
                marginBottom: 24,
              }}
            >
              — BEFORE / 2015
            </div>
            <h3
              className="font-serif-jp"
              style={{
                fontSize: 36,
                lineHeight: 1.3,
                fontWeight: 400,
                color: "var(--color-text-dim)",
                marginBottom: 32,
              }}
            >
              アイデアがあっても、
              <br />
              作れる人にしか作れなかった。
            </h3>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {before.map((t, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    fontSize: 15,
                    color: "var(--color-text-muted)",
                  }}
                >
                  <span className="font-mono-jp" style={{ color: "var(--color-text-dim)" }}>
                    0{i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: "var(--color-border-hair)" }} />

          {/* Now */}
          <div style={{ paddingLeft: 64 }}>
            <div
              className="font-mono-jp"
              style={{
                fontSize: 11,
                color: "var(--color-primary)",
                letterSpacing: "0.2em",
                marginBottom: 24,
              }}
            >
              — NOW / 2026
            </div>
            <h3
              className="font-serif-jp"
              style={{
                fontSize: 36,
                lineHeight: 1.3,
                fontWeight: 700,
                color: "var(--color-text)",
                marginBottom: 32,
              }}
            >
              アイデアがあれば、
              <br />
              <span style={{ color: "var(--color-primary)" }}>誰でも作れる。</span>
            </h3>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {now.map((t, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    fontSize: 15,
                    color: "var(--color-text)",
                  }}
                >
                  <span className="font-mono-jp" style={{ color: "var(--color-primary)" }}>
                    0{i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pull quote */}
        <div
          style={{
            marginTop: 120,
            padding: "64px 0",
            borderTop: "1px solid var(--color-border-hair)",
            borderBottom: "1px solid var(--color-border-hair)",
            textAlign: "center",
          }}
        >
          <span
            className="font-serif-jp"
            style={{
              fontSize: "clamp(28px, 3.5vw, 48px)",
              lineHeight: 1.4,
              fontStyle: "italic",
              color: "var(--color-text)",
            }}
          >
            「気づいた人から、
            <span style={{ color: "var(--color-primary)" }}>圧倒的な差</span>
            がつき始めている。」
          </span>
        </div>
      </div>
    </section>
  );
}
