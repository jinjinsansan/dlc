import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="relative z-10">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
          10年前には不可能だった。
          <br />
          <span className="text-primary">今日から、あなたにもできる。</span>
        </h1>
        <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          ノーコードで本格競馬AIを作った私が、その全てを教えます。
          <br />
          競馬AIの作り方を学ぶ。でも身につくのは、何でも作れる力です。
        </p>
        <Button href="/launch/episode/1" className="text-lg py-4 px-12">
          無料ローンチ動画を見る
        </Button>
      </div>
    </section>
  );
}
