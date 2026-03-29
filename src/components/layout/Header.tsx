"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="font-serif text-xl font-bold text-primary">
          Dlogic Academy
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#curriculum" className="text-text-muted hover:text-text-main transition-colors text-sm">
            カリキュラム
          </a>
          <a href="#pricing" className="text-text-muted hover:text-text-main transition-colors text-sm">
            料金プラン
          </a>
          <a href="#faq" className="text-text-muted hover:text-text-main transition-colors text-sm">
            FAQ
          </a>
          <a href="/login" className="text-text-muted hover:text-text-main transition-colors text-sm">
            ログイン
          </a>
          <Button href="/launch/episode/1" className="text-sm py-2 px-5">
            無料動画を見る
          </Button>
        </nav>

        <button
          className="md:hidden text-text-main"
          onClick={() => setMenuOpen(!menuOpen)}
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
          <a href="#curriculum" className="block text-text-muted hover:text-text-main">カリキュラム</a>
          <a href="#pricing" className="block text-text-muted hover:text-text-main">料金プラン</a>
          <a href="#faq" className="block text-text-muted hover:text-text-main">FAQ</a>
          <a href="/login" className="block text-text-muted hover:text-text-main">ログイン</a>
          <Button href="/launch/episode/1" className="w-full text-center text-sm py-2">
            無料動画を見る
          </Button>
        </nav>
      )}
    </header>
  );
}
