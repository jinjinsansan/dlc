import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";

export default function CTASection() {
  const { cohort, label, remainingSlots, deadline, isOpen } =
    siteConfig.recruitment;

  const deadlineDate = new Date(deadline);
  const formattedDeadline = `${deadlineDate.getFullYear()}年${
    deadlineDate.getMonth() + 1
  }月${deadlineDate.getDate()}日`;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
          さあ、<span className="text-primary">作れる側の人間</span>になろう
        </h2>
        {isOpen ? (
          <>
            <p className="text-text-muted mb-2 leading-relaxed">
              第{cohort}期生の募集は限定人数での受付となります。
              <br />
              定員に達し次第、募集を締め切ります。
            </p>
            <p className="text-text-muted text-sm mb-2">
              締切: {formattedDeadline}
            </p>
            <p className="text-primary font-bold text-lg mb-10">
              {label}募集中 ― 残り{remainingSlots}枠
            </p>
          </>
        ) : (
          <p className="text-text-muted mb-10 leading-relaxed">
            現在募集は締め切っております。次期募集をお待ちください。
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isOpen && (
            <Button href="/apply" className="text-lg py-4 px-12">
              今すぐ申し込む
            </Button>
          )}
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
