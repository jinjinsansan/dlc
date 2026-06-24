"use client";

import { useState } from "react";
import Link from "next/link";
import { enrollmentOpen } from "@/lib/siteConfig";
import EmailForm from "@/components/launch/EmailForm";

const PLANS = [
  {
    id: "video-only",
    name: "動画のみ",
    tag: "ARCHIVE",
    price: "49,800",
    body: "全講義動画アーカイブ閲覧。自分のペースで学ぶ。",
    features: ["全8週分の講義動画", "無期限視聴", "資料ダウンロード"],
  },
  {
    id: "video-email",
    name: "動画 + メール",
    tag: "RECOMMENDED",
    price: "98,000",
    body: "動画 + 個別メール相談。質問は無制限。",
    features: ["動画のみの全特典", "個別メール相談（無制限）", "質問への優先回答"],
    featured: true,
  },
  {
    id: "zoom",
    name: "Zoom型",
    tag: "COHORT 01",
    price: "150,000",
    body: "8週間×週1回2時間のライブZoom講座。",
    features: [
      "動画+メールの全特典",
      "週1回のライブZoom講座",
      "Zoomでの直接質問",
      "卒業後6ヶ月コミュニティ無料",
    ],
  },
];

function HeaderApply() {
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

function Steps({ active }: { active: number }) {
  const steps = ["プラン選択", "決済", "完了"];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        maxWidth: 600,
        margin: "0 auto 80px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 30,
          right: 30,
          height: 1,
          background: "var(--color-border-hair)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 30,
          width: `${(active / 2) * 100}%`,
          maxWidth: "calc(100% - 60px)",
          height: 1,
          background: "var(--color-primary)",
          transition: "width .3s",
        }}
      />
      {steps.map((s, i) => (
        <div key={i} style={{ position: "relative", textAlign: "center", flex: 1 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `1px solid ${i <= active ? "var(--color-primary)" : "var(--color-border)"}`,
              background: i <= active ? "var(--color-primary)" : "var(--color-bg)",
              color: i <= active ? "var(--color-bg-deep)" : "var(--color-text-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-serif)",
              position: "relative",
              zIndex: 1,
            }}
          >
            {i + 1}
          </div>
          <div
            className="font-mono-jp"
            style={{
              fontSize: 10,
              marginTop: 12,
              color: i <= active ? "var(--color-text)" : "var(--color-text-dim)",
              letterSpacing: "0.15em",
            }}
          >
            {s}
          </div>
        </div>
      ))}
    </div>
  );
}

function ComingSoon() {
  return (
    <>
      <HeaderApply />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "180px 32px 120px" }}>
        <div className="eyebrow" style={{ textAlign: "center", marginBottom: 24 }}>
          — COMING SOON / 準備中
        </div>
        <h1
          className="font-serif-jp"
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            marginBottom: 32,
          }}
        >
          ただいま
          <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>準備中</span>
          です。
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--color-text-muted)",
            lineHeight: 1.9,
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          AI Builders Lab は現在開講準備を進めています。
          <br />
          お申し込みの受付開始は、下記にメールアドレスをご登録いただいた方へ
          <br />
          いち早くお知らせします。
        </p>

        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-hair)",
            padding: 32,
          }}
        >
          <div
            className="font-mono-jp"
            style={{
              fontSize: 10,
              color: "var(--color-text-dim)",
              letterSpacing: "0.2em",
              marginBottom: 16,
            }}
          >
            NOTIFY ME / 公開通知を受け取る
          </div>
          <EmailForm />
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link
            href="/launch/episode/1"
            className="font-mono-jp"
            style={{ fontSize: 12, color: "var(--color-primary)", letterSpacing: "0.15em" }}
          >
            無料の紹介動画を見る →
          </Link>
        </div>
      </main>
    </>
  );
}

export default function ApplyPage() {
  const [planId, setPlanId] = useState<string>("video-email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!enrollmentOpen) {
    return <ComingSoon />;
  }

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderApply />
      <main style={{ padding: "140px 48px 120px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="eyebrow" style={{ textAlign: "center", marginBottom: 24 }}>
            — ENROLMENT
          </div>
          <h1
            className="font-serif-jp"
            style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 80,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>申し込み</span>
            を進める
          </h1>

          <Steps active={0} />

          {/* Plan selection */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: "var(--color-border-hair)",
              border: "1px solid var(--color-border-hair)",
            }}
          >
            {PLANS.map((p) => (
              <label
                key={p.id}
                style={{
                  background:
                    planId === p.id
                      ? "linear-gradient(180deg, rgba(201,168,76,0.08), var(--color-bg))"
                      : "var(--color-bg)",
                  padding: 40,
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  outline: planId === p.id ? "1px solid var(--color-primary)" : "none",
                  outlineOffset: -1,
                  transition: "all .2s",
                }}
              >
                <input
                  type="radio"
                  checked={planId === p.id}
                  onChange={() => setPlanId(p.id)}
                  style={{ position: "absolute", opacity: 0 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                  <span
                    className="font-mono-jp"
                    style={{
                      fontSize: 10,
                      color: p.featured ? "var(--color-primary)" : "var(--color-text-dim)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    {p.tag}
                  </span>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `1px solid ${planId === p.id ? "var(--color-primary)" : "var(--color-border)"}`,
                      background: planId === p.id ? "var(--color-primary)" : "transparent",
                    }}
                  />
                </div>
                <h3
                  className="font-serif-jp"
                  style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-muted)",
                    marginBottom: 24,
                    lineHeight: 1.7,
                  }}
                >
                  {p.body}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
                  <span className="font-serif-jp" style={{ fontSize: 12 }}>
                    ¥
                  </span>
                  <span
                    className="font-serif-jp"
                    style={{
                      fontSize: 44,
                      fontWeight: 700,
                      color: planId === p.id ? "var(--color-primary)" : "var(--color-text)",
                      lineHeight: 1,
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    {p.price}
                  </span>
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    flex: 1,
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {p.features.map((f, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        gap: 12,
                        fontSize: 13,
                        color: "var(--color-text-muted)",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--color-primary)",
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                        }}
                      >
                        —
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </label>
            ))}
          </div>

          {/* Selected summary */}
          <div
            style={{
              maxWidth: 560,
              margin: "60px auto 0",
              background: "var(--color-surface)",
              padding: 32,
              border: "1px solid var(--color-border-hair)",
            }}
          >
            <div
              className="font-mono-jp"
              style={{
                fontSize: 10,
                color: "var(--color-text-dim)",
                letterSpacing: "0.2em",
                marginBottom: 12,
              }}
            >
              SELECTED
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                className="font-serif-jp"
                style={{ fontSize: 22, fontWeight: 700 }}
              >
                {plan.name}
              </span>
              <span
                className="font-serif-jp"
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "var(--color-primary)",
                }}
              >
                ¥{plan.price}
              </span>
            </div>
          </div>

          {/* Payment notice */}
          <div
            style={{
              maxWidth: 560,
              margin: "32px auto 0",
              padding: 32,
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              textAlign: "center",
            }}
          >
            <div
              className="font-mono-jp"
              style={{
                fontSize: 11,
                color: "var(--color-text-dim)",
                letterSpacing: "0.2em",
                marginBottom: 12,
              }}
            >
              SECURE PAYMENT BY
            </div>
            <div
              className="font-serif-jp"
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "var(--color-primary)",
                marginBottom: 16,
              }}
            >
              Stripe
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                lineHeight: 1.7,
              }}
            >
              「決済に進む」を押すと Stripe の安全な決済画面に移動します。
              <br />
              クレジットカード情報は当サイトに保存されません。
            </p>
          </div>

          {error && (
            <p
              style={{
                color: "#ef4444",
                textAlign: "center",
                marginTop: 24,
                fontSize: 14,
              }}
            >
              {error}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary"
              style={{
                opacity: loading ? 0.5 : 1,
                padding: "22px 48px",
                fontSize: 15,
              }}
            >
              {loading ? "処理中..." : "決済に進む"} <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
