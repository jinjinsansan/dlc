import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import MemberSidebar from "@/components/layout/MemberSidebar";
import { getPlanAccess } from "@/lib/plans";
import { MemberProvider, MemberProfile } from "@/components/members/MemberContext";
import { isAdmin } from "@/lib/admin";

export default async function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("name, plan, community_free_until")
    .eq("email", user.email)
    .single();

  const plan = profile?.plan ?? null;
  const name = profile?.name ?? user.user_metadata?.name ?? "会員";
  const access = getPlanAccess(plan);

  const memberProfile: MemberProfile = {
    userId: user.id,
    email: user.email ?? "",
    name,
    plan,
    access,
    communityFreeUntil: profile?.community_free_until ?? null,
    isAdmin: isAdmin(user.email),
  };

  return (
    <MemberProvider profile={memberProfile}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          minHeight: "100vh",
        }}
      >
        <MemberSidebar access={access} name={name} plan={plan} />
        <main style={{ padding: "64px 64px 80px" }}>{children}</main>
      </div>
    </MemberProvider>
  );
}
