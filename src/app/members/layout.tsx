import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import MemberSidebar from "@/components/layout/MemberSidebar";
import MemberHeader from "@/components/layout/MemberHeader";
import { getPlanAccess } from "@/lib/plans";
import { MemberProvider, MemberProfile } from "@/components/members/MemberContext";

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
  };

  return (
    <MemberProvider profile={memberProfile}>
      <div className="min-h-screen bg-bg text-text-main">
        <MemberHeader name={name} access={access} />
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 flex gap-8">
          <MemberSidebar access={access} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </MemberProvider>
  );
}
