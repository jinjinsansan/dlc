"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { episodes } from "@/lib/episodes";

function PublicHeader() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border-hair)",
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
        <Link href="/" className="font-serif-jp" style={{ fontSize: 22, fontWeight: 700 }}>
          AI Builders <span style={{ color: "var(--color-primary)" }}>Lab</span>
        </Link>
        <Link
          href="/"
          className="font-mono-jp"
          style={{
            fontSize: 11,
            color: "var(--color-text-muted)",
            letterSpacing: "0.18em",
          }}
        >
          ← BACK TO HOME
        </Link>
      </div>
    </header>
  );
}

const EPISODE_DURATIONS = ["14:32", "18:45", "16:20", "22:10"];

export default function LaunchPage() {
  const [watched, setWatched] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("abl-watched");
      if (stored) setWatched(JSON.parse(stored));
    } catch {}
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-deep)" }}>
      <PublicHeader />
      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "140px 48px 120px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div
            className="font-mono-jp"
            style={{
              fontSize: 11,
              color: "var(--color-primary)",
              letterSpacing: "0.3em",
              marginBottom: 16,
            }}
          >
            LAUNCH SERIES · 4 EPISODES
          </div>
          <h1
            className="font-serif-jp"
            style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            無料公開{" "}
            <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
              動画
            </span>{" "}
            シリーズ
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "var(--color-text-muted)",
              lineHeight: 1.9,
              marginTop: 24,
              maxWidth: 560,
              margin: "24px auto 0",
            }}
          >
            第1期募集に先立ち、AI Builders Lab がなぜ生まれたか、
            何をどう教えるのかを 4 本の動画で公開しています。
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 32,
          }}
        >
          {episodes.map((ep, i) => {
            const dur = EPISODE_DURATIONS[i] ?? "—";
            const isWatched = watched.includes(ep.number);
            return (
              <Link
                key={ep.number}
                href={`/launch/episode/${ep.number}`}
                style={{
                  display: "block",
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border-hair)",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    aspectRatio: "16/9",
                    background:
                      "linear-gradient(135deg, #1a1a2a, #0a0a0f)",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid var(--color-border-hair)",
                  }}
                >
                  <div
                    className="font-serif-jp"
                    style={{
                      position: "absolute",
                      top: 24,
                      left: 32,
                      fontSize: 14,
                      color: "var(--color-primary)",
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    Ep. {String(ep.number).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      border: "2px solid var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-primary)",
                      fontSize: 28,
                    }}
                  >
                    ▶
                  </div>
                  <div
                    className="font-mono-jp"
                    style={{
                      position: "absolute",
                      bottom: 24,
                      right: 32,
                      fontSize: 11,
                      color: "var(--color-text-muted)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {dur}
                  </div>
                  {isWatched && (
                    <div
                      className="font-mono-jp"
                      style={{
                        position: "absolute",
                        bottom: 24,
                        left: 32,
                        fontSize: 10,
                        color: "var(--color-primary)",
                        letterSpacing: "0.2em",
                      }}
                    >
                      ✓ WATCHED
                    </div>
                  )}
                </div>
                <div style={{ padding: 32 }}>
                  <h3
                    className="font-serif-jp"
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      marginBottom: 12,
                      color: "var(--color-text)",
                    }}
                  >
                    {ep.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-muted)",
                      lineHeight: 1.8,
                    }}
                  >
                    {ep.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
