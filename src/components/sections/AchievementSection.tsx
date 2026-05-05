import SectionHead from "./SectionHead";

export default function AchievementSection() {
  const others = [
    { tag: "AI / GAME", title: "ガチャ型RPG", desc: "9日間で完成・運用中" },
    { tag: "AI / SAAS", title: "AIカウンセラー", desc: "月額制Webアプリ" },
    { tag: "DATA", title: "データ分析ツール", desc: "株・為替の自動分析" },
    { tag: "CONTENT", title: "コンテンツ自動生成", desc: "YouTube台本AI" },
    { tag: "LP / SAAS", title: "スワイプ型LP生成", desc: "ノーコードLP制作SaaS" },
    { tag: "COMMERCE", title: "EC買取査定システム", desc: "リアル店舗連動" },
  ];

  return (
    <section
      style={{
        padding: "160px 48px",
        background: "var(--color-bg-deep)",
        borderBottom: "1px solid var(--color-border-hair)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead
          num="02"
          kicker="EVIDENCE / WHAT I BUILT"
          title={
            <>
              講師がノーコードで
              <br />
              作ったもの。
            </>
          }
          intro="全てClaude Codeだけで開発。代表作は本格競馬予想AI。"
        />

        {/* Featured card */}
        <div
          style={{
            position: "relative",
            border: "1px solid var(--color-border)",
            background: "linear-gradient(135deg, rgba(201,168,76,0.06), transparent 60%)",
            padding: 64,
            marginBottom: 48,
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <div
              className="font-mono-jp"
              style={{
                fontSize: 11,
                color: "var(--color-primary)",
                letterSpacing: "0.2em",
                marginBottom: 16,
              }}
            >
              FEATURED — FLAGSHIP WORK
            </div>
            <h3
              className="font-serif-jp"
              style={{
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: 24,
                letterSpacing: "-0.01em",
              }}
            >
              本格
              <br />
              <span style={{ color: "var(--color-primary)" }}>競馬予想AI</span>
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "var(--color-text-muted)",
                lineHeight: 1.9,
                marginBottom: 32,
              }}
            >
              JRA全レースを対象とした予測エンジン。回収率・信頼度スコアの自動算出から有料会員管理まで、
              全機能をClaude Codeでゼロから構築。リリースから運用継続中。
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 0,
              }}
            >
              {[
                ["全機能", "ノーコード"],
                ["100%", "Claude Code"],
                ["運用中", "継続課金"],
              ].map(([v, l], i) => (
                <div
                  key={i}
                  style={{
                    borderLeft: i ? "1px solid var(--color-border-hair)" : "none",
                    paddingLeft: i ? 16 : 0,
                  }}
                >
                  <div
                    className="font-serif-jp"
                    style={{
                      fontSize: 24,
                      color: "var(--color-primary)",
                      fontWeight: 700,
                    }}
                  >
                    {v}
                  </div>
                  <div
                    className="font-mono-jp"
                    style={{
                      fontSize: 10,
                      color: "var(--color-text-dim)",
                      letterSpacing: "0.15em",
                      marginTop: 4,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual placeholder */}
          <div
            style={{
              aspectRatio: "4/3",
              border: "1px solid var(--color-border)",
              background: "linear-gradient(135deg, #12121e 0%, #1a1a2e 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                className="font-mono-jp"
                style={{
                  fontSize: 10,
                  color: "var(--color-text-dim)",
                  letterSpacing: "0.2em",
                }}
              >
                [ FLAGSHIP / 競馬予想AI ]
              </div>
              <svg viewBox="0 0 400 180" style={{ width: "100%", height: "auto" }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,140 L40,120 L80,130 L120,90 L160,100 L200,60 L240,75 L280,40 L320,55 L360,20 L400,30 L400,180 L0,180 Z"
                  fill="url(#g1)"
                />
                <path
                  d="M0,140 L40,120 L80,130 L120,90 L160,100 L200,60 L240,75 L280,40 L320,55 L360,20 L400,30"
                  stroke="#c9a84c"
                  strokeWidth="1.5"
                  fill="none"
                />
                {[40, 120, 200, 280, 360].map((x, idx) => (
                  <circle
                    key={x}
                    cx={x}
                    cy={[120, 90, 60, 40, 20][idx]}
                    r="3"
                    fill="#e8c96a"
                  />
                ))}
              </svg>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--color-text-dim)",
                  letterSpacing: "0.1em",
                }}
              >
                <span>JRA / WIN5</span>
                <span>RECOVERY 124%</span>
                <span>LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Other works */}
        <div
          className="font-mono-jp"
          style={{
            fontSize: 11,
            color: "var(--color-text-dim)",
            letterSpacing: "0.2em",
            marginBottom: 24,
          }}
        >
          OTHER WORKS / 06
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: "var(--color-border-hair)",
          }}
        >
          {others.map((o, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-bg-deep)",
                padding: 32,
                transition: "background .3s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <span
                  className="font-mono-jp"
                  style={{
                    fontSize: 10,
                    color: "var(--color-primary)",
                    letterSpacing: "0.2em",
                  }}
                >
                  {o.tag}
                </span>
                <span
                  className="font-serif-jp"
                  style={{ fontSize: 12, color: "var(--color-text-dim)" }}
                >
                  № 0{i + 1}
                </span>
              </div>
              <h4
                className="font-serif-jp"
                style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}
              >
                {o.title}
              </h4>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{o.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
