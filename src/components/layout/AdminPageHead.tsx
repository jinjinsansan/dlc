import { ReactNode } from "react";

interface Props {
  num: string;
  kicker: string;
  title: ReactNode;
  intro?: string;
}

export default function AdminPageHead({ num, kicker, title, intro }: Props) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <span
          className="font-serif-jp"
          style={{ fontSize: 13, color: "var(--color-primary)" }}
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
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>
      {intro && (
        <p
          style={{
            fontSize: 13,
            color: "var(--color-text-muted)",
            lineHeight: 1.8,
            marginTop: 12,
            maxWidth: 640,
          }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
