import Link from "next/link";
import SectionHead from "./SectionHead";
import { enrollmentOpen } from "@/lib/siteConfig";

export default function PricingSection() {
  const plans = [
    {
      id: "video",
      name: "動画のみ",
      tag: "ARCHIVE",
      price: "49,800",
      sub: "一括",
      body: "全講義動画アーカイブ閲覧。自分のペースで学ぶ。",
      features: ["全8週分の講義動画", "無期限視聴", "資料ダウンロード"],
    },
    {
      id: "mail",
      name: "動画 + メール",
      tag: "RECOMMENDED",
      price: "98,000",
      sub: "一括",
      body: "動画 + 個別メール相談。質問は無制限。",
      features: [
        "全8週分の講義動画",
        "無期限視聴",
        "資料ダウンロード",
        "個別メール相談（無制限）",
        "質問への優先回答",
      ],
      featured: true,
    },
    {
      id: "zoom",
      name: "Zoom型（1期生）",
      tag: "COHORT 01",
      price: "150,000",
      sub: "一括",
      body: "8週間×週1回2時間のライブZoom講座（録画あり）。",
      features: [
        "全8週分の講義動画",
        "週1回のライブZoom講座",
        "資料ダウンロード",
        "個別メール相談（無制限）",
        "Zoomでの直接質問",
        "卒業後6ヶ月コミュニティ無料",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      style={{
        padding: "160px 48px",
        borderBottom: "1px solid var(--color-border-hair)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead
          num="05"
          kicker="ENROLMENT / 3 PLANS"
          title={
            <>
              あなたのペースで、
              <br />
              <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
                選べる。
              </span>
            </>
          }
          intro={
            enrollmentOpen
              ? "全プラン一括払い、追加料金なし。Stripeでの安全な決済。"
              : "現在お申し込みは準備中です。公開通知をご希望の方はメールアドレスをご登録ください。"
          }
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
          {plans.map((p, idx) => (
            <div
              key={p.id}
              style={{
                background: p.featured
                  ? "linear-gradient(180deg, rgba(201,168,76,0.08), var(--color-bg))"
                  : "var(--color-bg)",
                padding: 48,
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {p.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "var(--color-primary)",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 24,
                }}
              >
                <span
                  className="font-mono-jp"
                  style={{
                    fontSize: 10,
                    color: p.featured
                      ? "var(--color-primary)"
                      : "var(--color-text-dim)",
                    letterSpacing: "0.2em",
                  }}
                >
                  {p.tag}
                </span>
                <span
                  className="font-mono-jp"
                  style={{
                    fontSize: 10,
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.15em",
                  }}
                >
                  0{idx + 1} / 03
                </span>
              </div>
              <h3
                className="font-serif-jp"
                style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}
              >
                {p.name}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                  marginBottom: 32,
                  lineHeight: 1.7,
                }}
              >
                {p.body}
              </p>
              <div
                style={{
                  marginBottom: 32,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                }}
              >
                <span
                  className="font-serif-jp"
                  style={{ fontSize: 14, color: "var(--color-text-muted)" }}
                >
                  ¥
                </span>
                <span
                  className="font-serif-jp"
                  style={{
                    fontSize: 56,
                    fontWeight: 700,
                    color: p.featured
                      ? "var(--color-primary)"
                      : "var(--color-text)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    fontFeatureSettings: '"tnum"',
                  }}
                >
                  {p.price}
                </span>
                <span
                  className="font-mono-jp"
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.15em",
                    marginLeft: 8,
                  }}
                >
                  {p.sub.toUpperCase()}
                </span>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 40,
                  flex: 1,
                  padding: 0,
                }}
              >
                {p.features.map((f, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      fontSize: 14,
                      color: "var(--color-text-muted)",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--color-primary)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        marginTop: 4,
                      }}
                    >
                      —
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/apply"
                className={`btn ${p.featured ? "btn-primary" : "btn-ghost"}`}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {enrollmentOpen ? (
                  <>
                    申し込む <span className="arrow">→</span>
                  </>
                ) : (
                  <>
                    近日公開・事前登録 <span className="arrow">→</span>
                  </>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
