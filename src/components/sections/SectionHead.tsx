import { ReactNode } from "react";

interface SectionHeadProps {
  num: string;
  kicker: string;
  title: ReactNode;
  intro?: string;
}

export default function SectionHead({ num, kicker, title, intro }: SectionHeadProps) {
  return (
    <div style={{ marginBottom: 80 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 24,
          marginBottom: 32,
        }}
      >
        <span
          className="font-serif-jp"
          style={{
            fontSize: 14,
            color: "var(--color-primary)",
            fontFeatureSettings: '"tnum"',
          }}
        >
          № {num}
        </span>
        <span className="eyebrow">{kicker}</span>
        <div style={{ flex: 1, height: 1, background: "var(--color-border-hair)" }} />
      </div>
      <h2
        className="font-serif-jp"
        style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          lineHeight: 1.1,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          maxWidth: 900,
        }}
      >
        {title}
      </h2>
      {intro && (
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.9,
            color: "var(--color-text-muted)",
            marginTop: 32,
            maxWidth: 640,
          }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
