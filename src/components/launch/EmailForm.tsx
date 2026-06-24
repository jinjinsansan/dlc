"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("launch_emails")
        .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

      if (error) throw error;

      setStatus("success");
      setMessage("✓ 登録完了。次回公開時にお送りします。");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("登録に失敗しました。もう一度お試しください。");
    }
  };

  if (status === "success") {
    return (
      <div
        style={{
          padding: 16,
          background: "rgba(201,168,76,0.08)",
          border: "1px solid rgba(201,168,76,0.3)",
          fontSize: 13,
          color: "var(--color-primary)",
        }}
      >
        {message}
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="form-input"
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn btn-primary"
          style={{ padding: "14px 24px", fontSize: 13, opacity: status === "loading" ? 0.5 : 1 }}
        >
          {status === "loading" ? "送信中..." : "登録"} <span className="arrow">→</span>
        </button>
      </form>
      {status === "error" && (
        <p style={{ color: "#ef4444", fontSize: 13, marginTop: 12 }}>{message}</p>
      )}
    </>
  );
}
