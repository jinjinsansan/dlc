"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const plans = [
  {
    id: "video-only",
    name: "動画のみ",
    price: "¥49,800",
    description: "全講義動画アーカイブ閲覧",
  },
  {
    id: "video-email",
    name: "動画 + メールサポート",
    price: "¥98,000",
    description: "動画閲覧 + 個別メール相談",
    recommended: true,
  },
  {
    id: "zoom",
    name: "Zoom型（1期生）",
    price: "¥150,000",
    description: "8週間×週1回2時間Zoom（録画あり）",
  },
];

export default function ApplyPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    // TODO: Stripe Checkout Session API呼び出し
    alert("Stripe決済連携は今後実装予定です");
  };

  return (
    <div className="min-h-screen bg-bg text-text-main">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-primary">プラン</span>を選択
          </h1>
          <p className="text-text-muted text-center mb-12">
            お好みのプランを選んでお申し込みください
          </p>

          <div className="space-y-4 mb-10">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                highlight={selectedPlan === plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? "ring-2 ring-primary"
                    : "hover:border-primary/30"
                }`}
              >
                <label className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={selectedPlan === plan.id}
                    onChange={() => setSelectedPlan(plan.id)}
                    className="w-5 h-5 accent-[#c9a84c]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      {plan.recommended && (
                        <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                          おすすめ
                        </span>
                      )}
                    </div>
                    <p className="text-text-muted text-sm mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <div className="font-serif text-xl font-bold text-primary">
                    {plan.price}
                  </div>
                </label>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={handleCheckout}
              className={`text-lg py-4 px-16 ${
                !selectedPlan ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!selectedPlan}
            >
              決済に進む
            </Button>
            <p className="text-text-muted text-sm mt-4">
              Stripeの安全な決済画面に移動します
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
