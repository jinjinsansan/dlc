import Link from "next/link";
import { DLabBrand } from "@/components/brand/DLabMark";

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
            <div style={{ marginBottom: 16 }}>
              <DLabBrand size={30} fontSize={24} />
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
            <p
              className="font-mono-jp"
              style={{
                fontSize: 10,
                color: "var(--color-text-dim)",
                letterSpacing: "0.12em",
                marginTop: 20,
              }}
            >
              D-market · D-swipe · Dlogic ファミリー
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
          <span>© {new Date().getFullYear()} D-LAB / ACADEMY.DLOGICAI.IN</span>
          <span>DESIGNED IN TOKYO</span>
        </div>
      </div>
    </footer>
  );
}
