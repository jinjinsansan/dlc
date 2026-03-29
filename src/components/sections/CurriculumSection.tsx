export default function CurriculumSection() {
  const weeks = [
    {
      week: 1,
      title: "Claude Codeとは・環境構築・AIへの指示の出し方",
    },
    {
      week: 2,
      title: "サービス設計の考え方・仕様書の書き方",
    },
    {
      week: 3,
      title: "Next.js + Supabaseの基本構成",
    },
    {
      week: 4,
      title: "フロントエンド制作（LP・UI）",
    },
    {
      week: 5,
      title: "予測ロジック・スコアリング設計",
    },
    {
      week: 6,
      title: "決済・サブスク機能の実装",
    },
    {
      week: 7,
      title: "デプロイ・本番運用・VPS管理",
    },
    {
      week: 8,
      title: "集客・マネタイズ・次のプロダクトへの展開",
    },
  ];

  return (
    <section id="curriculum" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-surface/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-primary">8週間</span>で、あなたは変わる
        </h2>
        <p className="text-text-muted text-sm sm:text-base text-center mb-10 sm:mb-16">
          実践重視のカリキュラムで、ゼロからプロダクト完成まで導きます
        </p>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2" />

          {weeks.map((item, i) => (
            <div key={i} className="relative pl-16 md:pl-0 mb-8 last:mb-0">
              <div
                className={`md:flex items-center ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <div className="bg-surface border border-border rounded-lg p-5 hover:border-primary/50 transition-colors">
                    <span className="text-primary font-bold text-sm">
                      Week {item.week}
                    </span>
                    <h3 className="font-bold mt-1">{item.title}</h3>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-2 border-bg top-5" />
                <div className="hidden md:block md:w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
