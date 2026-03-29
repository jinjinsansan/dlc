import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import MemberSidebar from "@/components/layout/MemberSidebar";
import MemberHeader from "@/components/layout/MemberHeader";
import { getPlanAccess } from "@/lib/plans";

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
    .select("name, plan")
    .eq("email", user.email)
    .single();

  const plan = profile?.plan ?? null;
  const name = profile?.name ?? user.user_metadata?.name ?? "会員";
  const access = getPlanAccess(plan);

  return (
    <div className="min-h-screen bg-bg text-text-main">
      <MemberHeader name={name} />
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 flex gap-8">
        <MemberSidebar access={access} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
