import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
          さあ、<span className="text-primary">作れる側の人間</span>になろう
        </h2>
        <p className="text-text-muted mb-4 leading-relaxed">
          第1期生の募集は限定人数での受付となります。
          <br />
          定員に達し次第、募集を締め切ります。
        </p>
        <p className="text-primary font-bold text-lg mb-10">
          1期生募集中 ― 残り枠わずか
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/apply" className="text-lg py-4 px-12">
            今すぐ申し込む
          </Button>
          <Button
            href="/launch/episode/1"
            variant="outline"
            className="text-lg py-4 px-12"
          >
            まずは無料動画を見る
          </Button>
        </div>
      </div>
    </section>
  );
}
