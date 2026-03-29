export default function AboutSection() {
  const pillars = [
    {
      icon: "📚",
      title: "学ぶ",
      description:
        "8週間の実践カリキュラムで、AIを使った個人開発の全工程をマスター",
    },
    {
      icon: "🛠️",
      title: "作る",
      description:
        "学んだ知識を即実践。自分だけのAIプロダクトを実際に作り上げる",
    },
    {
      icon: "💰",
      title: "稼ぐ",
      description:
        "マネタイズの方法まで完全網羅。作ったプロダクトで収益化を実現",
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
          Dlogic Academyは、
          <br className="md:hidden" />
          <span className="text-primary">作れる人間を増やす場所</span>です
        </h2>
        <p className="text-text-muted text-sm sm:text-base text-center max-w-2xl mx-auto mb-10 sm:mb-16 leading-relaxed">
          競馬AIの作り方を教えるが、本質は「何でも作れる力」を身につけること。
          学ぶだけでなく、仲間と作り、依頼し合えるコミュニティ。
        </p>

        <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 md:gap-8">
          {pillars.map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="font-serif text-xl font-bold text-primary mb-3">
                {item.title}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
