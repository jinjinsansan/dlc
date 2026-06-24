import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS, PlanId } from "@/lib/stripe";
import { enrollmentOpen } from "@/lib/siteConfig";

export async function POST(request: NextRequest) {
  try {
    // 受付停止中（準備中）はサーバー側で決済を拒否する
    if (!enrollmentOpen) {
      return NextResponse.json(
        { error: "現在、お申し込みの受付を停止しています（準備中）" },
        { status: 403 }
      );
    }

    const { planId } = await request.json();

    if (!planId || !(planId in PLANS)) {
      return NextResponse.json(
        { error: "無効なプランです" },
        { status: 400 }
      );
    }

    const plan = PLANS[planId as PlanId];

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `AI Builders Lab - ${plan.name}`,
              description: plan.description,
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.nextUrl.origin}/apply/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/apply`,
      metadata: {
        planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
