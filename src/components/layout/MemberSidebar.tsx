"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PlanAccess } from "@/lib/plans";
import { getPlanLabel } from "@/lib/plans";

interface NavItem {
  href: string;
  jp: string;
  en: string;
  accessKey?: keyof PlanAccess;
}

const navItems: NavItem[] = [
  { href: "/members/dashboard", jp: "ダッシュボード", en: "DASHBOARD" },
  { href: "/members/videos", jp: "動画ライブラリ", en: "VIDEOS", accessKey: "videos" },
  { href: "/members/materials", jp: "資料", en: "MATERIALS", accessKey: "materials" },
  { href: "/members/community", jp: "コミュニティ", en: "COMMUNITY", accessKey: "community" },
  { href: "/members/jobs", jp: "受発注ボード", en: "JOBS", accessKey: "jobs" },
  { href: "/members/support", jp: "サポート", en: "SUPPORT", accessKey: "support" },
  { href: "/members/mypage", jp: "マイページ", en: "MY PAGE" },
];

interface Props {
  access: PlanAccess;
  name: string;
  plan: string | null;
}

export default function MemberSidebar({ access, name, plan }: Props) {
  const pathname = usePathname();
  const initial = name.charAt(0) || "M";
  const planLabel = getPlanLabel(plan).toUpperCase();

  return (
    <aside
      style={{
        background: "var(--color-bg-deep)",
        borderRight: "1px solid var(--color-border-hair)",
        padding: "32px 0",
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: "0 32px 32px",
          borderBottom: "1px solid var(--color-border-hair)",
        }}
      >
        <Link
          href="/"
          className="font-serif-jp"
          style={{ fontSize: 20, fontWeight: 700, display: "block" }}
        >
          AI Builders <span style={{ color: "var(--color-primary)" }}>Lab</span>
        </Link>
        <span
          className="font-mono-jp"
          style={{
            fontSize: 10,
            color: "var(--color-text-dim)",
            letterSpacing: "0.18em",
          }}
        >
          MEMBERS · COHORT 01
        </span>
      </div>

      {/* Nav */}
      <nav style={{ padding: "32px 0", flex: 1 }}>
        {navItems.map((item, i) => {
          const allowed = !item.accessKey || access[item.accessKey];
          if (!allowed) return null;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: 16,
                alignItems: "center",
                padding: "14px 32px",
                background: active
                  ? "linear-gradient(90deg, rgba(201,168,76,0.08), transparent)"
                  : "transparent",
                borderLeft: active
                  ? "2px solid var(--color-primary)"
                  : "2px solid transparent",
                textDecoration: "none",
              }}
            >
              <span
                className="font-serif-jp"
                style={{
                  fontSize: 12,
                  color: active ? "var(--color-primary)" : "var(--color-text-dim)",
                  fontFeatureSettings: '"tnum"',
                }}
              >
                0{i + 1}
              </span>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    color: active ? "var(--color-text)" : "var(--color-text-muted)",
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  {item.jp}
                </div>
                <div
                  className="font-mono-jp"
                  style={{
                    fontSize: 9,
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.18em",
                  }}
                >
                  {item.en}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User chip */}
      <div
        style={{
          padding: "24px 32px",
          borderTop: "1px solid var(--color-border-hair)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-primary)",
            fontFamily: "var(--font-serif)",
            fontWeight: 700,
          }}
        >
          {initial}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </div>
          <div
            className="font-mono-jp"
            style={{
              fontSize: 10,
              color: "var(--color-text-dim)",
              letterSpacing: "0.15em",
            }}
          >
            {planLabel}
          </div>
        </div>
      </div>
    </aside>
  );
}
