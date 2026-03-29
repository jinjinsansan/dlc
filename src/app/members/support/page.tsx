"use client";

import { useEffect, useState, useCallback } from "react";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { useMember } from "@/components/members/MemberContext";

interface Ticket {
  id: string;
  subject: string;
  body: string;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open: { label: "未対応", color: "text-yellow-400" },
  in_progress: { label: "対応中", color: "text-blue-400" },
  closed: { label: "完了", color: "text-green-400" },
};

export default function SupportPage() {
  const member = useMember();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const fetchTickets = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("tickets")
      .select("id, subject, body, status, created_at")
      .eq("user_id", member.userId)
      .order("created_at", { ascending: false });

    setTickets(data ?? []);
    setLoading(false);
  }, [member.userId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSubmitting(true);
    setMessage("");

    const supabase = createClient();

    let fileUrl: string | null = null;
    if (file) {
      const fileName = `${member.userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("support-files")
        .upload(fileName, file);

      if (!uploadError) {
        fileUrl = fileName;
      }
    }

    const { error } = await supabase.from("tickets").insert({
      user_id: member.userId,
      subject: subject.trim(),
      body: body.trim(),
      file_url: fileUrl,
      status: "open",
    });

    if (error) {
      setMessage("送信に失敗しました");
    } else {
      setMessage("相談を送信しました。返信をお待ちください。");
      setSubject("");
      setBody("");
      setFile(null);
      fetchTickets();
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-2">質問・サポート</h1>
      <p className="text-text-muted text-sm mb-8">
        メールで個別相談ができます
      </p>

      {/* Submit Form */}
      <Card className="mb-8">
        <h2 className="font-bold mb-4">新しい相談</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">件名</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="相談の件名を入力"
              className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">本文</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={5}
              placeholder="相談内容を詳しく記入してください"
              className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">
              ファイル添付（任意）
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-text-muted file:bg-surface file:hover:bg-border/30 file:transition-colors file:cursor-pointer"
            />
          </div>
          {message && (
            <p className={`text-sm ${message.includes("失敗") ? "text-red-400" : "text-green-400"}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !subject.trim() || !body.trim()}
            className="bg-primary hover:bg-primary-light text-bg font-bold text-sm px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? "送信中..." : "送信する"}
          </button>
        </form>
      </Card>

      {/* Ticket History */}
      <h2 className="font-bold text-lg mb-4">過去の相談履歴</h2>
      {loading ? (
        <p className="text-text-muted text-center py-8">読み込み中...</p>
      ) : tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const status = STATUS_LABELS[ticket.status] ?? STATUS_LABELS.open;
            return (
              <Card key={ticket.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-text-muted text-xs">
                        {new Date(ticket.created_at).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm">{ticket.subject}</h3>
                    <p className="text-text-muted text-sm mt-1 line-clamp-2 whitespace-pre-wrap">
                      {ticket.body}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-8">
          <p className="text-text-muted">まだ相談履歴がありません</p>
        </Card>
      )}
    </div>
  );
}
