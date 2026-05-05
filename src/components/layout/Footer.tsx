import Link from "next/link";

export default function Footer() {
  const sections: [string, [string, string][]][] = [
    [
      "LEARN",
      [
        ["カリキュラム", "/#curriculum"],
        ["ローンチ動画", "/launch/episode/1"],
        ["料金", "/#pricing"],
      ],
    ],
    [
      "MEMBERS",
      [
        ["ダッシュボード", "/members/dashboard"],
        ["ログイン", "/login"],
        ["会員登録", "/register"],
      ],
    ],
    [
      "LEGAL",
      [
        ["特定商取引法", "/legal/tokushoho"],
        ["プライバシー", "/legal/privacy"],
      ],
    ],
  ];

  return (
    <footer
      style={{
        padding: "80px 48px 48px",
        background: "var(--color-bg-deep)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 64,
            marginBottom: 64,
          }}
        >
          <div>
            <div
              className="font-serif-jp"
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              AI Builders <span style={{ color: "var(--color-primary)" }}>Lab</span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                lineHeight: 1.8,
                maxWidth: 320,
              }}
            >
              ノーコードで本格AIプロダクトを作る、個人開発者養成コミュニティ。
              ノーコードで本格競馬予想AIを作った実績者が教える。
            </p>
          </div>
          {sections.map(([title, links]) => (
            <div key={title}>
              <div
                className="font-mono-jp"
                style={{
                  fontSize: 11,
                  color: "var(--color-text-dim)",
                  letterSpacing: "0.2em",
                  marginBottom: 16,
                }}
              >
                {title}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: 0,
                  margin: 0,
                }}
              >
                {links.map(([l, h]) => (
                  <li key={l}>
                    <Link
                      href={h}
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="font-mono-jp"
          style={{
            borderTop: "1px solid var(--color-border-hair)",
            paddingTop: 32,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "var(--color-text-dim)",
          }}
        >
          <span>© {new Date().getFullYear()} AI BUILDERS LAB / ACADEMY.ANATOUAI.COM</span>
          <span>DESIGNED IN TOKYO</span>
        </div>
      </div>
    </footer>
  );
}
