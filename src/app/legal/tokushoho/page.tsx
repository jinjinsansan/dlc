import PublicHeader from "@/components/layout/PublicHeader";

const items: [string, string][] = [
  ["販売事業者名", "D-lab 運営事務局"],
  ["代表者", "請求があった場合に遅滞なく開示いたします"],
  ["所在地", "請求があった場合に遅滞なく開示いたします"],
  ["電話番号", "請求があった場合に遅滞なく開示いたします"],
  ["メールアドレス", "info@ai-builders-lab.com（仮）"],
  [
    "販売価格",
    "動画のみプラン: ¥49,800（税込）\n動画＋メールサポートプラン: ¥98,000（税込）\nZoom 型プラン: ¥150,000（税込）\nコミュニティ月額: ¥2,980〜¥4,980 / 月（税込）",
  ],
  ["支払方法", "クレジットカード（Stripe 決済）"],
  ["支払時期", "購入時に即時決済"],
  ["商品の引渡時期", "決済完了後、即時にサービスをご利用いただけます"],
  [
    "返品・キャンセルについて",
    "デジタルコンテンツの性質上、購入後の返品・返金はお受けしておりません。ただし、受講開始から 14 日以内、第 1 週の動画視聴前であれば全額返金いたします。",
  ],
  [
    "動作環境",
    "インターネット接続環境、最新の Web ブラウザ（Chrome、Safari、Edge 等）",
  ],
];

export default function TokushohoPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PublicHeader />
      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "140px 32px 100px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            className="font-mono-jp"
            style={{
              fontSize: 11,
              color: "var(--color-primary)",
              letterSpacing: "0.3em",
              marginBottom: 16,
            }}
          >
            LEGAL · COMMERCIAL TRANSACTIONS
          </div>
          <h1
            className="font-serif-jp"
            style={{
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            特定商取引法
            <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
              に基づく表記
            </span>
          </h1>
        </div>

        <dl style={{ display: "flex", flexDirection: "column", margin: 0, padding: 0 }}>
          {items.map(([k, v], i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: 24,
                padding: "24px 0",
                borderBottom: "1px solid var(--color-border-hair)",
              }}
            >
              <dt
                className="font-mono-jp"
                style={{
                  fontSize: 11,
                  color: "var(--color-text-dim)",
                  letterSpacing: "0.15em",
                  paddingTop: 4,
                }}
              >
                {k.toUpperCase()}
              </dt>
              <dd
                style={{
                  fontSize: 14,
                  color: "var(--color-text-muted)",
                  lineHeight: 1.9,
                  whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                <div
                  className="font-serif-jp"
                  style={{
                    fontSize: 13,
                    color: "var(--color-text)",
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {k}
                </div>
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}
