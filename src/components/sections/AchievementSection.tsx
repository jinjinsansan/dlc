import Card from "@/components/ui/Card";

export default function AchievementSection() {
  const achievements = [
    {
      title: "Dlogic",
      description: "AI競馬予測サービス - 本格的な機械学習による競馬予測を実現",
      tag: "競馬AI",
    },
    {
      title: "AIガチャゲーム",
      description: "AI画像生成を活用したエンターテインメントアプリ",
      tag: "ゲーム",
    },
    {
      title: "AIカウンセラー",
      description: "AI対話型カウンセリングサービス",
      tag: "AI対話",
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-surface/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
          私が<span className="text-primary">ノーコード</span>で作ったもの
        </h2>
        <p className="text-text-muted text-sm sm:text-base text-center mb-10 sm:mb-16">
          全てClaude Codeだけで開発。プログラミング知識は不要でした。
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {achievements.map((item, i) => (
            <Card key={i} className="text-center hover:border-primary/50 transition-colors">
              <div className="w-full h-40 bg-bg rounded-lg mb-4 flex items-center justify-center">
                <span className="text-text-muted text-sm">スクリーンショット</span>
              </div>
              <span className="inline-block bg-primary/20 text-primary text-xs px-3 py-1 rounded-full mb-3">
                {item.tag}
              </span>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-text-muted text-sm">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
