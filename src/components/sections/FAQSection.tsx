import SectionHead from "./SectionHead";

export default function FAQSection() {
  const items: [string, string][] = [
    [
      "プログラミング経験がなくても大丈夫ですか？",
      "大丈夫です。本講座はプログラミング未経験者を前提に設計されています。コードを書く時間より、AIに正しく指示を出す練習に重点を置きます。",
    ],
    [
      "競馬の知識がなくても受講できますか？",
      "問題ありません。題材として競馬AIに触れますが、本質は「何でも作れる力」の習得です。8週間で作るプロダクトはあなた自身のアイデアで構いません。",
    ],
    [
      "動画はいつまで視聴できますか？",
      "無期限です。一度購入すれば、講座終了後もずっと視聴できます。",
    ],
    [
      "Zoom型は録画を後から見られますか？",
      "はい。全Zoomセッションは録画され、24時間以内にアーカイブとしてアップされます。当日参加できなくても問題ありません。",
    ],
    [
      "返金保証はありますか？",
      "受講開始から14日以内、第1週の動画視聴前であれば全額返金いたします。",
    ],
  ];

  return (
    <section
      id="faq"
      style={{
        padding: "160px 48px",
        borderBottom: "1px solid var(--color-border-hair)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead
          num="06"
          kicker="QUESTIONS"
          title={
            <>
              気になることに、
              <br />
              <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
                ひとつずつ。
              </span>
            </>
          }
        />
        <div style={{ borderTop: "1px solid var(--color-border-hair)" }}>
          {items.map(([q, a], i) => (
            <details
              key={i}
              style={{ borderBottom: "1px solid var(--color-border-hair)" }}
            >
              <summary
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr auto",
                  gap: 24,
                  alignItems: "center",
                  padding: "28px 0",
                  cursor: "pointer",
                  listStyle: "none",
                }}
              >
                <span
                  className="font-mono-jp"
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.15em",
                  }}
                >
                  Q.0{i + 1}
                </span>
                <h3
                  className="font-serif-jp"
                  style={{ fontSize: 20, fontWeight: 400 }}
                >
                  {q}
                </h3>
                <span
                  className="font-mono-jp"
                  style={{ fontSize: 14, color: "var(--color-primary)" }}
                >
                  +
                </span>
              </summary>
              <div
                style={{
                  padding: "0 0 32px 84px",
                  maxWidth: 800,
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--color-text-muted)",
                    lineHeight: 1.9,
                  }}
                >
                  {a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
