import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook signature missing" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const planId = session.metadata?.planId;
    const email = session.customer_details?.email?.toLowerCase();
    const name = session.customer_details?.name ?? undefined;
    const customerId =
      typeof session.customer === "string" ? session.customer : null;

    if (email && planId) {
      const supabaseAdmin = getSupabaseAdmin();

      // created_at は upsert に含めない（再送時に上書きしないため。
      // 新規行は DB の default now() が入る）。updated_at は常に更新。
      const payload: Record<string, unknown> = {
        email,
        plan: planId,
        stripe_session_id: session.id,
        updated_at: new Date().toISOString(),
      };
      if (name) payload.name = name;
      if (customerId) payload.stripe_customer_id = customerId;

      const { error } = await supabaseAdmin
        .from("users")
        .upsert(payload, { onConflict: "email" });

      if (error) {
        // 失敗時は 500 を返し Stripe にリトライさせる（冪等な upsert なので安全）
        console.error("Supabase user upsert error:", error);
        return NextResponse.json(
          { error: "user sync failed" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
