import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

const navItems = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/announcements", label: "お知らせ" },
  { href: "/admin/videos", label: "動画管理" },
  { href: "/admin/materials", label: "資料管理" },
  { href: "/admin/users", label: "会員管理" },
  { href: "/admin/community", label: "コミュニティ" },
  { href: "/admin/tickets", label: "サポート" },
  { href: "/admin/jobs", label: "受発注" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-bg text-text-main">
      <header className="fixed top-0 w-full z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-xl font-bold text-primary">
            Admin
          </Link>
          <Link href="/members/dashboard" className="text-text-muted hover:text-text-main text-sm">
            会員エリアへ
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 flex gap-8">
        <aside className="w-52 shrink-0 hidden lg:block">
          <nav className="sticky top-20 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2.5 rounded-lg text-sm text-text-muted hover:text-text-main hover:bg-surface transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
