import SectionHead from "./SectionHead";

export default function CurriculumSection() {
  const weeks = [
    { w: "01", t: "はじめてのClaude Code", d: "入れて、話しかけて、感動する。AIへの正しい指示の出し方を体に染み込ませる。" },
    { w: "02", t: "日本語だけでWebページを作る", d: "コードを一切書かず、最初のWebサイトを公開する。" },
    { w: "03", t: "デザインをAIに注文する", d: "プロの見た目に仕上げるための語彙とプロンプト。" },
    { w: "04", t: "機能を言葉で追加する", d: "ログイン、データ保存、フォーム。Supabase連携を日本語で。" },
    { w: "05", t: "AIの力をアプリに入れる", d: "チャット、要約、分析。ClaudeをAPIから呼び出す。" },
    { w: "06", t: "完成させて世界に公開する", d: "デプロイ。URLが生まれる瞬間、あなたは「作った人」になる。" },
    { w: "07", t: "お金を受け取れるようにする", d: "Stripe決済の導入。サブスク・買い切り両方の実装。" },
    { w: "08", t: "お客さんを集めて稼ぐ", d: "SNS告知、SEO、最初の売上を立てる戦術一式。" },
  ];

  return (
    <section
      id="curriculum"
      style={{
        padding: "160px 48px",
        background: "var(--color-bg-deep)",
        borderBottom: "1px solid var(--color-border-hair)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead
          num="04"
          kicker="CURRICULUM / 8 WEEKS"
          title={
            <>
              8週間で、
              <br />
              あなたは
              <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
                変わる。
              </span>
            </>
          }
          intro="毎週、新しいプロダクトを完成させる。手は動かす。コードは書かない。"
        />

        <div style={{ borderTop: "1px solid var(--color-border-hair)" }}>
          {weeks.map((wk, i) => (
            <details
              key={i}
              style={{ borderBottom: "1px solid var(--color-border-hair)" }}
            >
              <summary
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr auto",
                  alignItems: "center",
                  gap: 32,
                  padding: "32px 0",
                  cursor: "pointer",
                  listStyle: "none",
                  transition: "all .2s",
                }}
              >
                <div
                  className="font-serif-jp"
                  style={{
                    fontSize: 56,
                    fontWeight: 700,
                    color: "var(--color-primary)",
                    lineHeight: 1,
                    fontFeatureSettings: '"tnum"',
                  }}
                >
                  {wk.w}
                </div>
                <h3
                  className="font-serif-jp"
                  style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.3 }}
                >
                  {wk.t}
                </h3>
                <span
                  className="font-mono-jp"
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.2em",
                  }}
                >
                  + READ
                </span>
              </summary>
              <div
                style={{
                  padding: "0 0 40px 152px",
                  maxWidth: 800,
                }}
              >
                <p
                  style={{
                    fontSize: 16,
                    color: "var(--color-text-muted)",
                    lineHeight: 1.9,
                  }}
                >
                  {wk.d}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
