import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";

const episodes = [
  {
    number: 1,
    title: "AIが変えた、個人開発の常識",
    description: "時代の変化・AIで何でも作れる現実",
  },
  {
    number: 2,
    title: "Dlogicはこうして生まれた",
    description: "開発実録・使ったツール・失敗談",
  },
  {
    number: 3,
    title: "あなたにも同じことができる理由",
    description: "受講者目線・学習ロードマップ・卒業後のビジョン",
  },
  {
    number: 4,
    title: "Dlogic Academy、始まります",
    description: "サロン全貌・料金・申し込み方法",
  },
];

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-bg text-text-main">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-center mb-4">
            無料ローンチ<span className="text-primary">動画シリーズ</span>
          </h1>
          <p className="text-text-muted text-center mb-12">
            全4話であなたの可能性が変わる
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {episodes.map((ep) => (
              <a key={ep.number} href={`/launch/episode/${ep.number}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <div className="w-full aspect-video bg-bg rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-primary text-4xl font-serif font-bold">
                      {ep.number}
                    </span>
                  </div>
                  <span className="text-primary text-sm font-bold">
                    第{ep.number}話
                  </span>
                  <h2 className="font-bold text-lg mt-1 mb-2">{ep.title}</h2>
                  <p className="text-text-muted text-sm">{ep.description}</p>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
