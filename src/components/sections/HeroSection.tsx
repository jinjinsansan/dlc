import Link from "next/link";
import ParticleField from "./ParticleField";
import { siteConfig } from "@/lib/siteConfig";

export default function HeroSection() {
  const seatsLeft = siteConfig.recruitment.remainingSlots;

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        borderBottom: "1px solid var(--color-border-hair)",
      }}
    >
      <ParticleField />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 900,
          background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Top meta strip */}
      <div
        style={{
          position: "absolute",
          top: 92,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 48px",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--color-text-dim)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          zIndex: 2,
        }}
      >
        <span>VOL. 01 / FIRST COHORT</span>
        <span>TOKYO — REMOTE</span>
        <span>2026 SPRING INTAKE</span>
      </div>

      {/* Vertical Japanese accent */}
      <div
        className="tate"
        style={{
          position: "absolute",
          top: 140,
          left: 48,
          fontSize: 13,
          color: "var(--color-text-dim)",
          letterSpacing: "0.4em",
          zIndex: 2,
        }}
      >
        作 れ る 側 の 人 間 に な る
      </div>

      {/* Center stack */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "180px 120px 120px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
        }}
      >
        <div className="eyebrow">— A NEW SCHOOL FOR THE POST-CODE ERA</div>

        <h1
          className="font-serif-jp"
          style={{
            fontSize: "clamp(52px, 8vw, 124px)",
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <span
            style={{
              color: "var(--color-text-dim)",
              display: "block",
              fontSize: "0.42em",
              letterSpacing: "0.1em",
              marginBottom: 24,
              fontWeight: 400,
            }}
          >
            10年前には、不可能だった。
          </span>
          <span>今日から、</span>
          <br />
          <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
            あなたにも、
          </span>
          <br />
          <span>できる。</span>
        </h1>

        {/* Lede + CTAs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 80,
            marginTop: 24,
            alignItems: "end",
          }}
        >
          <div>
            <div
              className="font-mono-jp"
              style={{
                fontSize: 11,
                color: "var(--color-text-dim)",
                letterSpacing: "0.2em",
                marginBottom: 16,
              }}
            >
              — NOTE FROM THE FOUNDER
            </div>
            <p
              className="font-serif-jp"
              style={{
                fontSize: 18,
                lineHeight: 1.9,
                color: "var(--color-text)",
                fontStyle: "italic",
              }}
            >
              ノーコードで本格
              <span style={{ color: "var(--color-primary)" }}>競馬予想AI</span>
              を作った私が、その全てを8週間で教えます。題材は競馬AI。
              身につくのは、
              <span style={{ borderBottom: "1px solid var(--color-primary)" }}>
                何でも作れる力
              </span>
              。
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            <Link href="/launch/episode/1" className="btn btn-primary">
              無料ローンチ動画を見る <span className="arrow">→</span>
            </Link>
            <Link href="/#pricing" className="btn btn-ghost">
              料金プランを見る
            </Link>
            <div
              className="font-mono-jp"
              style={{
                fontSize: 11,
                color: "var(--color-text-dim)",
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: "#c9a84c",
                  borderRadius: "50%",
                  boxShadow: "0 0 8px #c9a84c",
                  display: "inline-block",
                }}
              />
              1期生 残り {seatsLeft} / {siteConfig.recruitment.maxSlots} 名
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stat strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid var(--color-border-hair)",
          padding: "32px 48px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
          background: "rgba(6,6,10,0.4)",
          backdropFilter: "blur(8px)",
          zIndex: 2,
        }}
      >
        {[
          ["10+", "Products Released", "個人開発したプロダクト"],
          ["0", "Lines of Code Written", "書いたコードの行数"],
          ["8", "Weeks to Build", "あなたが作れるまで"],
          ["¥0", "Engineer Salary", "エンジニアの雇用費"],
        ].map(([n, en, jp], i) => (
          <div
            key={i}
            style={{
              borderLeft: i ? "1px solid var(--color-border-hair)" : "none",
              paddingLeft: i ? 32 : 0,
            }}
          >
            <div
              className="font-serif-jp"
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "var(--color-primary)",
                lineHeight: 1,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {n}
            </div>
            <div
              className="font-mono-jp"
              style={{
                fontSize: 10,
                color: "var(--color-text-dim)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginTop: 12,
              }}
            >
              {en}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>
              {jp}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
