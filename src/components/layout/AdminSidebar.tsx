"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: { href: string; jp: string; en: string }[] = [
  { href: "/admin", jp: "概要", en: "OVERVIEW" },
  { href: "/admin/users", jp: "会員", en: "USERS" },
  { href: "/admin/videos", jp: "動画", en: "VIDEOS" },
  { href: "/admin/materials", jp: "資料", en: "MATERIALS" },
  { href: "/admin/announcements", jp: "お知らせ", en: "NEWS" },
  { href: "/admin/community", jp: "コミュニティ", en: "COMMUNITY" },
  { href: "/admin/jobs", jp: "受発注", en: "JOBS" },
  { href: "/admin/tickets", jp: "チケット", en: "TICKETS" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        background: "#0d0d14",
        borderRight: "1px solid var(--color-border-hair)",
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "24px 24px 20px",
          borderBottom: "1px solid var(--color-border-hair)",
        }}
      >
        <div className="font-serif-jp" style={{ fontSize: 17, fontWeight: 700 }}>
          AIBL <span style={{ color: "var(--color-primary)" }}>Admin</span>
        </div>
        <div
          className="font-mono-jp"
          style={{
            fontSize: 9,
            color: "var(--color-text-dim)",
            letterSpacing: "0.18em",
            marginTop: 4,
          }}
        >
          CONTROL PANEL
        </div>
      </div>
      <nav style={{ padding: "20px 0", flex: 1 }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "11px 24px",
                fontSize: 13,
                background: active
                  ? "linear-gradient(90deg, rgba(201,168,76,0.08), transparent)"
                  : "transparent",
                borderLeft: active
                  ? "2px solid var(--color-primary)"
                  : "2px solid transparent",
                color: active ? "var(--color-text)" : "var(--color-text-muted)",
                fontWeight: active ? 600 : 400,
                textDecoration: "none",
              }}
            >
              <span>{item.jp}</span>
              <span
                className="font-mono-jp"
                style={{
                  fontSize: 9,
                  color: "var(--color-text-dim)",
                  letterSpacing: "0.18em",
                }}
              >
                {item.en}
              </span>
            </Link>
          );
        })}
      </nav>
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid var(--color-border-hair)",
        }}
      >
        <Link
          href="/members/dashboard"
          className="font-mono-jp"
          style={{
            fontSize: 10,
            color: "var(--color-text-dim)",
            letterSpacing: "0.18em",
          }}
        >
          ← 会員エリアへ
        </Link>
      </div>
    </aside>
  );
}
