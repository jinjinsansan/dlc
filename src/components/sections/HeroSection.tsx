import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="font-serif text-[26px] sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-[1.3]">
          10年前には不可能だった。<br />
          <span className="text-primary">今日から、あなたにも<br className="sm:hidden" />できる。</span>
        </h1>
        <p className="text-text-muted text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
          AIを使って複数のプロダクトを生み出した私が、その全てを教えます。AIプロダクトの作り方を学ぶ。そして身につくのは、何でも作れる力です。
        </p>
        <Button href="/launch/episode/1" className="text-base sm:text-lg py-3 sm:py-4 px-8 sm:px-12">
          無料ローンチ動画を見る
        </Button>
      </div>
    </section>
  );
}
