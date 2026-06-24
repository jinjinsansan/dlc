"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上にしてください");
      return;
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("パスワードは英字と数字を含めてください");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/register/confirm");
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
        <Link href="/" className="font-serif-jp" style={{ fontSize: 22, fontWeight: 700 }}>
          D-<span style={{ color: "var(--color-primary)" }}>lab</span>
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
            SIGN UP / 会員登録
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
            さあ、
            <br />
            <span style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
              はじめよう
            </span>
            。
          </h1>

          <form
            onSubmit={handleRegister}
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
                NAME / お名前
              </label>
              <input
                className="form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="山田 太郎"
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
              <p
                style={{
                  fontSize: 11,
                  color: "var(--color-primary)",
                  marginTop: 6,
                  lineHeight: 1.6,
                }}
              >
                ※ 決済時と同じメールアドレスをご入力ください
              </p>
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
                minLength={8}
                placeholder="8文字以上・英数字を含む"
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
                CONFIRM PASSWORD
              </label>
              <input
                className="form-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="再入力"
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
              {loading ? "登録中..." : "登録する"} <span className="arrow">→</span>
            </button>

            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-muted)",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              既にアカウントをお持ちの方は{" "}
              <Link href="/login" style={{ color: "var(--color-primary)" }}>
                ログイン →
              </Link>
            </p>
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
          © {new Date().getFullYear()} D-LAB
        </div>
      </div>

      {/* Right: brand panel */}
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
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            — JOIN COHORT 01
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
            「コードを 1 行も書かずに、本物のサービスを作れる時代が、
            <br />
            ついに始まった。」
          </p>
          <div
            className="font-mono-jp"
            style={{
              marginTop: 32,
              fontSize: 12,
              color: "var(--color-text-dim)",
              letterSpacing: "0.18em",
            }}
          >
            — D-LAB / 8 WEEKS · 1 PRODUCT
          </div>
        </div>
      </div>
    </div>
  );
}
