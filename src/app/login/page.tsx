"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
      return;
    }

    router.push("/members/dashboard");
    router.refresh();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {/* Left: form */}
      <div
        style={{
          padding: "80px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          className="font-serif-jp"
          style={{ fontSize: 22, fontWeight: 700 }}
        >
          AI Builders <span style={{ color: "var(--color-primary)" }}>Lab</span>
        </Link>

        <div style={{ maxWidth: 400 }}>
          <div
            className="font-mono-jp"
            style={{
              fontSize: 11,
              color: "var(--color-primary)",
              letterSpacing: "0.3em",
              marginBottom: 16,
            }}
          >
            SIGN IN / 会員ログイン
          </div>
          <h1
            className="font-serif-jp"
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
              marginBottom: 48,
            }}
          >
            続きから、
            <br />
            <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
              始めましょう
            </span>
            。
          </h1>

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div>
              <label
                className="font-mono-jp"
                style={{
                  fontSize: 11,
                  color: "var(--color-text-dim)",
                  letterSpacing: "0.15em",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                EMAIL
              </label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="taro@example.com"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label
                className="font-mono-jp"
                style={{
                  fontSize: 11,
                  color: "var(--color-text-dim)",
                  letterSpacing: "0.15em",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                PASSWORD
              </label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                style={{ width: "100%" }}
              />
            </div>

            {error && (
              <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                justifyContent: "center",
                marginTop: 16,
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? "ログイン中..." : "ログイン"} <span className="arrow">→</span>
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "var(--color-text-muted)",
                marginTop: 8,
              }}
            >
              <Link href="/register" style={{ color: "var(--color-primary)" }}>
                新規登録 →
              </Link>
              <span style={{ color: "var(--color-text-muted)" }}>
                パスワードを忘れた
              </span>
            </div>
          </form>
        </div>

        <div
          className="font-mono-jp"
          style={{
            fontSize: 10,
            color: "var(--color-text-dim)",
            letterSpacing: "0.18em",
          }}
        >
          © {new Date().getFullYear()} AI BUILDERS LAB
        </div>
      </div>

      {/* Right: testimonial / brand panel */}
      <div
        style={{
          background: "var(--color-bg-deep)",
          borderLeft: "1px solid var(--color-border-hair)",
          padding: "80px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-30%",
            width: "80%",
            aspectRatio: "1",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.08), transparent 70%)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            className="font-serif-jp"
            style={{
              fontSize: 14,
              color: "var(--color-primary)",
              marginBottom: 24,
            }}
          >
            &ldquo;
          </div>
          <p
            className="font-serif-jp"
            style={{
              fontSize: 24,
              lineHeight: 1.7,
              color: "var(--color-text-muted)",
              fontStyle: "italic",
            }}
          >
            「3 週間で、自分のアプリが動いた瞬間、世界が違って見えた。」
          </p>
          <div
            className="font-mono-jp"
            style={{
              marginTop: 32,
              fontSize: 12,
              color: "var(--color-text-dim)",
            }}
          >
            — 第 1 期生 K.T (営業職)
          </div>
        </div>
      </div>
    </div>
  );
}
