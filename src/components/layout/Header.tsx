"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { enrollmentOpen } from "@/lib/siteConfig";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-border-hair)" : "1px solid transparent",
        transition: "all .3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <Link
            href="/"
            className="font-serif-jp"
            style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.02em" }}
          >
            AI Builders <span style={{ color: "var(--color-primary)" }}>Lab</span>
          </Link>
          <span className="font-mono-jp" style={{ fontSize: 10, color: "var(--color-text-dim)" }}>
            EST. 2026
          </span>
        </div>
        <nav
          style={{
            display: "flex",
            gap: 36,
            alignItems: "center",
          }}
        >
          {[
            ["About", "/#about"],
            ["Curriculum", "/#curriculum"],
            ["Plans", "/#pricing"],
            ["FAQ", "/#faq"],
          ].map(([l, h]) => (
            <Link
              key={l}
              href={h}
              className="font-mono-jp"
              style={{
                fontSize: 12,
                letterSpacing: "0.12em",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
              }}
            >
              {l}
            </Link>
          ))}
          <Link
            href="/login"
            className="font-mono-jp"
            style={{
              fontSize: 12,
              letterSpacing: "0.12em",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
            }}
          >
            Log In
          </Link>
          <Link href="/apply" className="btn btn-primary" style={{ padding: "12px 22px", fontSize: 12 }}>
            {enrollmentOpen ? "APPLY" : "COMING SOON"} <span className="arrow">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
