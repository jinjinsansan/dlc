import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient();

  const [{ count: userCount }, { count: postCount }, { count: ticketCount }, { count: jobCount }] =
    await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("jobs").select("*", { count: "exact", head: true }),
    ]);

  const stats = [
    { label: "会員数", en: "USERS", value: userCount ?? 0, href: "/admin/users" },
    { label: "コミュニティ投稿", en: "POSTS", value: postCount ?? 0, href: "/admin/community" },
    { label: "未対応チケット", en: "OPEN TICKETS", value: ticketCount ?? 0, href: "/admin/tickets" },
    { label: "受発注案件", en: "JOBS", value: jobCount ?? 0, href: "/admin/jobs" },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <span className="font-serif-jp" style={{ fontSize: 14, color: "var(--color-primary)" }}>
          № 01
        </span>
        <span className="eyebrow">ADMIN OVERVIEW</span>
        <div style={{ flex: 1, height: 1, background: "var(--color-border-hair)" }} />
      </div>
      <h1
        className="font-serif-jp"
        style={{
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          marginBottom: 48,
        }}
      >
        管理者ダッシュボード
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          background: "var(--color-border-hair)",
          border: "1px solid var(--color-border-hair)",
        }}
      >
        {stats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              background: "var(--color-bg-deep)",
              padding: 32,
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              className="font-mono-jp"
              style={{
                fontSize: 10,
                color: "var(--color-primary)",
                letterSpacing: "0.2em",
              }}
            >
              {s.en}
            </div>
            <div
              className="font-serif-jp"
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: "var(--color-text)",
                lineHeight: 1,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{s.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
