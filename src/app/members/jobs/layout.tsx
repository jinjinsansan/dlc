import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPlanAccess } from "@/lib/plans";
import { isAdmin } from "@/lib/admin";

/**
 * 受発注ボードはサーバー側でアクセス権を検査する。
 * jobs 権限を持つプラン (zoom) と管理者のみ許可。
 */
export default async function JobsGateLayout({
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
    if (!access.jobs) {
      redirect("/members/dashboard");
    }
  }

  return <>{children}</>;
}
