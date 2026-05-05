import { ReactNode } from "react";

interface Props {
  num: string;
  kicker: string;
  title: ReactNode;
  intro?: string;
}

export default function PageHead({ num, kicker, title, intro }: Props) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <span
          className="font-serif-jp"
          style={{ fontSize: 14, color: "var(--color-primary)" }}
        >
          № {num}
        </span>
        <span className="eyebrow">{kicker}</span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "var(--color-border-hair)",
          }}
        />
      </div>
      <h1
        className="font-serif-jp"
        style={{
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h1>
      {intro && (
        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-muted)",
            lineHeight: 1.9,
            marginTop: 16,
            maxWidth: 640,
          }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
