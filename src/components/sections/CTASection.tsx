import Link from "next/link";
import { siteConfig, enrollmentOpen } from "@/lib/siteConfig";

export default function CTASection() {
  const seatsLeft = siteConfig.recruitment.remainingSlots;
  const deadlineDate = new Date(siteConfig.recruitment.deadline);
  const formattedDeadline = `${deadlineDate.getFullYear()}年${
    deadlineDate.getMonth() + 1
  }月${deadlineDate.getDate()}日`;

  return (
    <section
      style={{
        padding: "160px 48px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid var(--color-border-hair)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 32 }}>
          — LAST CALL / COHORT 01
        </div>
        <h2
          className="font-serif-jp"
          style={{
            fontSize: "clamp(48px, 7vw, 96px)",
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 40,
          }}
        >
          さあ、
          <br />
          <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
            作れる側の人間
          </span>
          に
          <br />
          なろう。
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "var(--color-text-muted)",
            lineHeight: 1.9,
            marginBottom: 56,
            maxWidth: 540,
            margin: "0 auto 56px",
          }}
        >
          {enrollmentOpen
            ? `1期生 残り ${seatsLeft}名。締切：${formattedDeadline}。`
            : "1期生の募集はまもなく開始します。公開通知をご希望の方はメールアドレスをご登録ください。"}
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/apply"
            className="btn btn-primary"
            style={{ padding: "22px 40px", fontSize: 15 }}
          >
            {enrollmentOpen ? "申し込む" : "事前登録する"} <span className="arrow">→</span>
          </Link>
          <Link
            href="/launch/episode/1"
            className="btn btn-ghost"
            style={{ padding: "22px 40px", fontSize: 15 }}
          >
            無料動画を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
