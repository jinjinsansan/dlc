"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MemberHeader({ name }: { name: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/members/dashboard" className="font-serif text-xl font-bold text-primary">
          Dlogic Academy
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <span className="text-text-muted text-sm">
            {name} さん
          </span>
          <button
            onClick={handleLogout}
            className="text-text-muted hover:text-text-main text-sm transition-colors"
          >
            ログアウト
          </button>
        </div>

        <button
          className="md:hidden text-text-main"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-surface border-t border-border px-4 py-4 space-y-3">
          <Link href="/members/dashboard" className="block text-text-muted hover:text-text-main" onClick={() => setMenuOpen(false)}>ダッシュボード</Link>
          <Link href="/members/videos" className="block text-text-muted hover:text-text-main" onClick={() => setMenuOpen(false)}>動画ライブラリ</Link>
          <Link href="/members/materials" className="block text-text-muted hover:text-text-main" onClick={() => setMenuOpen(false)}>資料ダウンロード</Link>
          <Link href="/members/mypage" className="block text-text-muted hover:text-text-main" onClick={() => setMenuOpen(false)}>マイページ</Link>
          <button onClick={handleLogout} className="block text-text-muted hover:text-text-main w-full text-left">
            ログアウト
          </button>
        </nav>
      )}
    </header>
  );
}
