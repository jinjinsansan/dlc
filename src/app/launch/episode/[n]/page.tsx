import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

const episodes = [
  {
    number: 1,
    title: "AIが変えた、個人開発の常識",
    description:
      "AIの進化により、個人でもプロ品質のプロダクトが作れる時代が来ました。この動画では、時代がどう変わったのか、そしてなぜ今がチャンスなのかをお伝えします。",
    purpose: "共感・興味喚起",
  },
  {
    number: 2,
    title: "Dlogicはこうして生まれた",
    description:
      "競馬AI予測サービス「Dlogic」の開発実録をお見せします。どんなツールを使い、どんな失敗を経て、どうやって完成させたのか。リアルなストーリーをお届けします。",
    purpose: "信頼構築・実績提示",
  },
  {
    number: 3,
    title: "あなたにも同じことができる理由",
    description:
      "「自分にもできるのか？」という不安に答えます。受講者目線で学習ロードマップを解説し、卒業後にどんな未来が待っているのかをお伝えします。",
    purpose: "欲求喚起・不安解消",
  },
  {
    number: 4,
    title: "Dlogic Academy、始まります",
    description:
      "Dlogic Academyの全貌を公開。カリキュラム詳細、料金プラン、申し込み方法を詳しくご説明します。",
    purpose: "クロージング・CTA",
  },
];

export function generateStaticParams() {
  return [{ n: "1" }, { n: "2" }, { n: "3" }, { n: "4" }];
}

export default function EpisodePage({ params }: { params: { n: string } }) {
  const episodeNum = parseInt(params.n, 10);
  const episode = episodes.find((ep) => ep.number === episodeNum);

  if (!episode) {
    notFound();
  }

  const prevEp = episodeNum > 1 ? episodeNum - 1 : null;
  const nextEp = episodeNum < 4 ? episodeNum + 1 : null;

  return (
    <div className="min-h-screen bg-bg text-text-main">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-primary font-bold text-sm">
            第{episode.number}話 ― {episode.purpose}
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mt-2 mb-8">
            {episode.title}
          </h1>

          {/* Video Player Placeholder (Cloudflare Stream) */}
          <div className="w-full aspect-video bg-surface border border-border rounded-xl mb-8 flex items-center justify-center">
            <div className="text-center">
              <p className="text-text-muted mb-2">動画プレイヤー</p>
              <p className="text-text-muted text-sm">
                Cloudflare Stream 埋め込み予定
              </p>
            </div>
          </div>

          <p className="text-text-muted leading-relaxed mb-8">
            {episode.description}
          </p>

          {/* Episode 4: Apply CTA */}
          {episodeNum === 4 && (
            <div className="bg-surface border border-primary/30 rounded-xl p-8 text-center mb-8">
              <h2 className="font-serif text-xl font-bold mb-3">
                準備はできましたか？
              </h2>
              <p className="text-text-muted mb-6">
                Dlogic Academyで、作れる側の人間になりましょう。
              </p>
              <Button href="/apply" className="text-lg py-3 px-10">
                今すぐ申し込む
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-border">
            {prevEp ? (
              <a
                href={`/launch/episode/${prevEp}`}
                className="text-text-muted hover:text-primary transition-colors"
              >
                ← 第{prevEp}話
              </a>
            ) : (
              <span />
            )}
            <a
              href="/launch"
              className="text-text-muted hover:text-primary transition-colors text-sm"
            >
              一覧に戻る
            </a>
            {nextEp ? (
              <a
                href={`/launch/episode/${nextEp}`}
                className="text-text-muted hover:text-primary transition-colors"
              >
                第{nextEp}話 →
              </a>
            ) : (
              <span />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
