"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { getPlanLabel } from "@/lib/plans";

interface Profile {
  name: string;
  plan: string | null;
  email: string;
}

export default function MyPagePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("name, plan")
        .eq("email", user.email)
        .single();

      const p: Profile = {
        name: data?.name ?? user.user_metadata?.name ?? "",
        plan: data?.plan ?? null,
        email: user.email ?? "",
      };
      setProfile(p);
      setName(p.name);
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({ name })
      .eq("email", profile.email);

    if (error) {
      setMessage("保存に失敗しました");
    } else {
      setMessage("保存しました");
    }
    setSaving(false);
  };

  if (!profile) {
    return (
      <div className="text-text-muted text-center py-16">読み込み中...</div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-8">マイページ</h1>

      <Card className="mb-6">
        <h2 className="font-bold mb-4">プロフィール編集</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">お名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">
              メールアドレス
            </label>
            <p className="text-text-muted text-sm px-4 py-3 bg-bg border border-border rounded-lg">
              {profile.email}
            </p>
          </div>
          {message && (
            <p className="text-sm text-primary">{message}</p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary-light text-bg font-bold py-2 px-6 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存する"}
          </button>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="font-bold mb-4">現在のプラン</h2>
        <p className="text-primary font-bold text-lg">
          {getPlanLabel(profile.plan)}
        </p>
      </Card>
    </div>
  );
}
