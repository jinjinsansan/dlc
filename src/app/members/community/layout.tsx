import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPlanAccess } from "@/lib/plans";
import { isAdmin } from "@/lib/admin";

/**
 * コミュニティはサーバー側でアクセス権を検査する。
 * - 管理者 / community 権限を持つプラン (zoom) は常に許可
 * - community_free_until が未来日なら、下位プランでも一時的に許可（プロモ枠）
 */
export default async function CommunityGateLayout({
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
      .select("plan, community_free_until")
      .eq("email", user.email)
      .single();

    const access = getPlanAccess(profile?.plan ?? null);
    const freeUntil = profile?.community_free_until
      ? new Date(profile.community_free_until)
      : null;
    const inFreeWindow = !!freeUntil && freeUntil > new Date();

    if (!access.community && !inFreeWindow) {
      redirect("/members/dashboard");
    }
  }

  return <>{children}</>;
}
