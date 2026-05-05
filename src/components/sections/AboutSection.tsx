import SectionHead from "./SectionHead";

export default function AboutSection() {
  const pillars = [
    {
      n: "03 / 01",
      jp: "学ぶ",
      en: "Learn",
      body:
        "8週間のカリキュラムで、AI個人開発の全てを体系的に学ぶ。コードは書かない。日本語で話しかけるだけ。",
    },
    {
      n: "03 / 02",
      jp: "作る",
      en: "Build",
      body:
        "受講中に最低3つのプロダクトを作る。LP、Webアプリ、SaaS。仲間とレビューし合い、磨き上げる。",
    },
    {
      n: "03 / 03",
      jp: "稼ぐ",
      en: "Earn",
      body:
        "受発注ボードで仲間と仕事を回し合う。卒業後はClaude Code開発者として独立する道も。",
    },
  ];

  return (
    <section
      style={{
        padding: "160px 48px",
        borderBottom: "1px solid var(--color-border-hair)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead
          num="03"
          kicker="THE LAB / WHAT WE ARE"
          title={
            <>
              AI Builders Labは、
              <br />
              <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
                作れる人間
              </span>
              を増やす場所。
            </>
          }
          intro="ただ学ぶだけの場所ではない。仲間と作り、依頼し合い、稼ぐコミュニティ。3つの柱で、あなたの「作れる力」を育てる。"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: "var(--color-border-hair)",
            border: "1px solid var(--color-border-hair)",
          }}
        >
          {pillars.map((p, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-bg)",
                padding: 56,
                minHeight: 360,
                position: "relative",
              }}
            >
              <div
                className="font-mono-jp"
                style={{
                  fontSize: 11,
                  color: "var(--color-text-dim)",
                  letterSpacing: "0.2em",
                  marginBottom: 32,
                }}
              >
                {p.n}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <h3
                  className="font-serif-jp"
                  style={{
                    fontSize: 80,
                    fontWeight: 700,
                    color: "var(--color-primary)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {p.jp}
                </h3>
                <span
                  className="font-mono-jp"
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  {p.en}
                </span>
              </div>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-text-muted)",
                  lineHeight: 1.9,
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
