import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPlanAccess } from "@/lib/plans";
import { isAdmin } from "@/lib/admin";

/**
 * メールサポートはサーバー側でアクセス権を検査する。
 * support 権限を持つプラン (video-email / zoom) と管理者のみ許可。
 */
export default async function SupportGateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (!isAdmin(user.email)) {
    const { data: profile } = await supabase
      .from("users")
      .select("plan")
      .eq("email", user.email)
      .single();

    const access = getPlanAccess(profile?.plan ?? null);
    if (!access.support) {
      redirect("/members/dashboard");
    }
  }

  return <>{children}</>;
}
