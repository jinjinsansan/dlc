"""
Week 1 本編動画用の HTML composition を生成する。

35 シーンをテンプレート化して 1 つの index.html に出力。
各シーンは固有の data-track-index を持ち、GSAP timeline で同期。
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Callable

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT / "audio" / "main_lesson_scenes"))
from week01_data import WEEK01_MAIN_SCENES, TOTAL_DURATION  # type: ignore

OUTPUT = ROOT / "week01-main" / "index.html"
WIDTH = 1920
HEIGHT = 1080

# トラック割当
# 0-2: 背景 / 3: ブランドバッジ / 10〜: シーン要素 / 200〜: 音声
SCENE_TRACK_BASE = 10
TRACKS_PER_SCENE = 6  # 各シーン 6 トラックまで
AUDIO_TRACK_BASE = 200


# ─────────────────────────────────────────────────────────────────────────
# シーン視覚データ (各シーンの type + 内容)
# ─────────────────────────────────────────────────────────────────────────
SCENE_VISUAL: dict[str, dict] = {
    "O1": {
        "type": "welcome",
        "title": "ようこそ。",
        "subtitle": "Week 1 — はじめての Claude Code",
    },
    "O2": {
        "type": "promise",
        "pretext": "30 分後、あなたの PC で。",
        "main": "本物のアプリが、",
        "main_accent": "動いている",
        "post": "コードは、1 行も書かない。",
    },
    "1-1": {"type": "chapter", "num": "1", "title": "Claude Code って、何?"},
    "1-2": {
        "type": "comparison",
        "left_label": "普通の AI",
        "left_text": "「メモ帳の作り方を教えて」\n→ 文字で説明してくれる",
        "left_role": "知識豊富な相談相手",
        "right_label": "Claude Code",
        "right_text": "「メモ帳を作って」\n→ 本当にアプリを作る",
        "right_role": "手を動かす部下",
        "highlight": "right",
    },
    "1-3": {
        "type": "statement",
        "main": "クロード・コードは、",
        "main_accent": "実際に手を動かす",
        "sub": "文章で答えるのではなく、PC の中でファイルを作り、コードを書き、アプリを動かす。",
    },
    "1-4": {
        "type": "duo",
        "left_label": "普通の AI",
        "left_role": "= 相談相手",
        "right_label": "Claude Code",
        "right_role": "= 部下",
    },
    "1-5": {
        "type": "iconography",
        "header": "日本語で頼むだけで、何が作れる?",
        "items": [
            {"icon": "📱", "label": "アプリ"},
            {"icon": "🌐", "label": "Web サイト"},
            {"icon": "🤖", "label": "AI 機能"},
            {"icon": "💳", "label": "決済機能"},
        ],
    },
    "1-6": {
        "type": "statement",
        "main": "Claude Code = ",
        "main_accent": "あなたの優秀な部下",
        "sub": "日本語で頼むと、本当に動いてくれる。",
    },
    "2-1": {"type": "chapter", "num": "2", "title": "なぜ、今がチャンスなのか"},
    "2-2": {
        "type": "comparison",
        "left_label": "10 年前",
        "left_text": "・プログラミング言語を\n  数年学習\n・外注で数百万円",
        "left_role": "ハードルが高すぎた",
        "right_label": "今",
        "right_text": "・日本語で頼むだけ\n・30 分で完成\n・誰でも作れる",
        "right_role": "革命が起きた",
        "highlight": "right",
    },
    "2-3": {
        "type": "big_statement",
        "main": "革命",
        "sub": "日本語 ・ 30 分 ・ 無料 ・ 誰でも",
    },
    "2-4": {
        "type": "stats",
        "big": "99 %",
        "label": "の人は、まだ気づいていない。",
        "footer": "気づいた人から、圧倒的な差がつく。",
    },
    "3-1": {"type": "chapter", "num": "3", "title": "PC にインストールしよう"},
    "3-2": {
        "type": "terminal",
        "label": "Mac の方",
        "lines": [
            "1. ⌘ + Space",
            "2. 「ターミナル」と打つ",
            "3. Enter",
        ],
        "footer": "黒い画面が開いたら成功",
    },
    "3-3": {
        "type": "terminal",
        "label": "Windows の方",
        "lines": [
            "1. Windows キー",
            "2. 「PowerShell」と打つ",
            "3. Enter",
        ],
        "footer": "青い画面が開いたら成功",
    },
    "3-3b": {
        "type": "terminal_cmd",
        "label": "インストールコマンド",
        "command": "npm install -g @anthropic-ai/claude-code",
        "footer": "コピー & ペースト → Enter",
    },
    "3-4": {
        "type": "terminal_cmd",
        "label": "起動",
        "command": "claude\n>",
        "footer": "矢印 (>) が出たら成功 ✨",
    },
    "3-5": {
        "type": "checklist",
        "header": "うまくいかなかったら",
        "items": [
            "ターミナルを再起動",
            "コミュニティに投稿",
            "30 分以内に必ず解決",
        ],
        "footer": "1 人で抱え込まない、これが鉄則",
    },
    "4-1": {"type": "chapter", "num": "4", "title": "最初の一言を、話しかけてみよう"},
    "4-2": {
        "type": "terminal_cmd",
        "label": "最初の挨拶",
        "command": "> こんにちは\n\n✓ こんにちは!\n  お手伝いできることはありますか?",
        "footer": "AI が返事をくれた = 接続成功",
    },
    "4-3": {
        "type": "terminal_cmd",
        "label": "ファイルを作ってもらう",
        "command": "> このフォルダに hello.txt を作って\n\n✓ 作成: hello.txt",
        "footer": "本当にファイルが PC の中に生まれる",
    },
    "4-4": {
        "type": "big_statement",
        "main": "動いた。",
        "sub": "あなたの世界は、今、変わり始めた。",
    },
    "5-1": {"type": "chapter", "num": "5", "title": "メモ帳アプリを、作ってもらおう"},
    "5-2": {
        "type": "terminal_cmd",
        "label": "フォルダ移動 + 起動",
        "command": "$ cd ~/my-apps\n$ claude\n>",
        "footer": "作業フォルダに入って、Claude Code 起動",
    },
    "5-3": {
        "type": "terminal_cmd",
        "label": "一言で完成",
        "command": "> シンプルなメモ帳アプリを作って。\n  白い背景で、文字が自動保存されるやつ。\n\n✓ index.html\n✓ style.css\n✓ app.js",
        "footer": "Claude Code が必要なファイルを自動生成",
    },
    "5-4": {
        "type": "statement",
        "main": "ダブルクリック → ",
        "main_accent": "ブラウザで動く",
        "sub": "文字を打って、閉じて、もう一度開いても、書いた内容が残っている。",
    },
    "5-5": {
        "type": "big_statement",
        "main": "あなたは、作れる人になった。",
        "sub": "おめでとう。",
    },
    "6-1": {"type": "chapter", "num": "6", "title": "上手に頼む 5 つのコツ"},
    "6-2": {
        "type": "tip",
        "num": "1",
        "tip": "具体的に",
        "bad": "「メモ帳作って」",
        "good": "「白背景、文字保存つきメモ帳」",
    },
    "6-3": {
        "type": "tip",
        "num": "2",
        "tip": "一度に 1 つだけ",
        "bad": "5 個同時にお願い",
        "good": "1 個ずつ完成 → 次へ",
    },
    "6-4": {
        "type": "tip",
        "num": "3",
        "tip": "例を見せる",
        "bad": "「いい感じに」",
        "good": "「Notion みたいに」",
    },
    "6-5": {
        "type": "tip",
        "num": "4",
        "tip": "ここを → こうして",
        "bad": "「なんか違う」",
        "good": "「タイトル色を黒に」",
    },
    "6-6": {
        "type": "tip",
        "num": "5",
        "tip": "褒めてから直す",
        "bad": "「ダメ、直して」",
        "good": "「最高!1 点だけ…」",
    },
    "7-1": {
        "type": "checklist",
        "header": "今週の宿題",
        "items": [
            "好きなアプリを 3 つ作る",
            "スクリーンショットを撮る",
            "コミュニティに投稿",
        ],
        "footer": "電卓・占い・ゲーム、何でも OK",
    },
    "7-2": {
        "type": "closing",
        "main": "Week 2 で、",
        "main_accent": "また会いましょう",
        "sub": "あなたは、もう作れる人です。",
    },
}


# ─────────────────────────────────────────────────────────────────────────
# CSS (全シーンで使うスタイル)
# ─────────────────────────────────────────────────────────────────────────
CSS = """
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  margin: 0;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  background: #0a0a0f;
  font-family: "Noto Sans JP", sans-serif;
  color: #f0f0f0;
}
.serif { font-family: "Noto Serif JP", serif; }
.mono { font-family: "JetBrains Mono", "Consolas", monospace; }
.clip { position: absolute; opacity: 0; }

/* ── Background layers ── */
.bg-base {
  inset: 0;
  background:
    radial-gradient(circle at 50% 20%, rgba(201, 168, 76, 0.15), transparent 55%),
    radial-gradient(circle at 50% 80%, rgba(201, 168, 76, 0.05), transparent 60%),
    #0a0a0f;
  opacity: 1 !important;
}
.bg-vignette {
  inset: 0;
  background: radial-gradient(circle at center, transparent 50%, rgba(0, 0, 0, 0.65) 100%);
  opacity: 1 !important;
  pointer-events: none;
}
.bg-glow {
  top: 50%; left: 50%;
  width: 1400px; height: 1400px;
  margin-top: -700px; margin-left: -700px;
  background: radial-gradient(circle, rgba(232, 201, 106, 0.20) 0%, transparent 60%);
  filter: blur(40px);
  border-radius: 50%;
}

/* ── Brand badge ── */
.brand-badge {
  top: 40px; right: 60px;
  display: flex; align-items: center; gap: 12px;
  padding: 12px 24px;
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: 999px;
  backdrop-filter: blur(8px);
  z-index: 100;
}
.brand-badge .dot {
  width: 10px; height: 10px;
  background: #c9a84c; border-radius: 50%;
  box-shadow: 0 0 12px rgba(201, 168, 76, 0.8);
}
.brand-badge .text {
  font-family: "Noto Serif JP", serif;
  font-weight: 700; font-size: 22px;
  color: #e8c96a; letter-spacing: 0.08em;
}

/* ── Scene container (full screen, centered) ── */
.scene {
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px;
  text-align: center;
}

/* ── Welcome / Promise / Statement / Big Statement / Closing ── */
.welcome-title, .closing-title {
  font-family: "Noto Serif JP", serif;
  font-weight: 900;
  font-size: 180px;
  background: linear-gradient(180deg, #f0f0f0 0%, #e8c96a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  line-height: 1.2;
}
.welcome-subtitle, .closing-subtitle {
  font-family: "Noto Serif JP", serif;
  font-weight: 500;
  font-size: 48px;
  color: #c9c9d8;
  letter-spacing: 0.05em;
}

.promise-pretext {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 56px;
  color: #c9c9d8;
  margin-bottom: 30px;
}
.promise-main {
  font-family: "Noto Serif JP", serif;
  font-weight: 900;
  font-size: 100px;
  color: #f0f0f0;
  margin-bottom: 20px;
  line-height: 1.2;
}
.promise-main .accent {
  background: linear-gradient(180deg, #e8c96a 0%, #c9a84c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.promise-post {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 42px;
  color: #8888aa;
  margin-top: 30px;
}

.statement-main {
  font-family: "Noto Serif JP", serif;
  font-weight: 900;
  font-size: 96px;
  color: #f0f0f0;
  margin-bottom: 30px;
  line-height: 1.3;
}
.statement-main .accent {
  background: linear-gradient(180deg, #e8c96a 0%, #c9a84c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.statement-sub {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 42px;
  color: #c9c9d8;
  max-width: 1200px;
  line-height: 1.6;
}

.big-statement-main {
  font-family: "Noto Serif JP", serif;
  font-weight: 900;
  font-size: 280px;
  background: linear-gradient(180deg, #f0f0f0 0%, #e8c96a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 40px;
  line-height: 1;
}
.big-statement-sub {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 48px;
  color: #c9c9d8;
  letter-spacing: 0.1em;
}

/* ── Chapter Title ── */
.chapter-num {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 36px;
  color: #c9a84c;
  letter-spacing: 0.5em;
  margin-bottom: 20px;
}
.chapter-num-big {
  font-family: "Noto Serif JP", serif;
  font-weight: 900;
  font-size: 320px;
  background: linear-gradient(180deg, #f0f0f0 0%, #e8c96a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 30px;
}
.chapter-title {
  font-family: "Noto Serif JP", serif;
  font-weight: 700;
  font-size: 84px;
  color: #f0f0f0;
  margin-bottom: 30px;
  letter-spacing: 0.04em;
}
.chapter-divider {
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #c9a84c, transparent);
}

/* ── Comparison (left vs right) ── */
.comparison-container {
  display: flex;
  gap: 60px;
  width: 100%;
  max-width: 1700px;
  align-items: stretch;
}
.comparison-card {
  flex: 1;
  padding: 60px;
  background: linear-gradient(180deg, rgba(18, 18, 30, 0.95), rgba(18, 18, 30, 0.7));
  border: 2px solid rgba(201, 168, 76, 0.25);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.comparison-card.highlight {
  border-color: rgba(201, 168, 76, 0.7);
  box-shadow: 0 0 40px rgba(201, 168, 76, 0.2);
}
.comparison-label {
  font-family: "Noto Serif JP", serif;
  font-weight: 700;
  font-size: 56px;
  color: #c9c9d8;
  margin-bottom: 30px;
}
.comparison-card.highlight .comparison-label {
  color: #e8c96a;
}
.comparison-text {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 36px;
  color: #f0f0f0;
  white-space: pre-line;
  margin-bottom: 30px;
  line-height: 1.6;
}
.comparison-role {
  font-family: "Noto Serif JP", serif;
  font-weight: 700;
  font-size: 32px;
  color: #c9a84c;
  letter-spacing: 0.05em;
  padding-top: 30px;
  border-top: 1px solid rgba(201, 168, 76, 0.3);
  width: 100%;
}

/* ── Duo (small left/right comparison) ── */
.duo-container {
  display: flex;
  gap: 80px;
  align-items: center;
  justify-content: center;
}
.duo-side { text-align: center; }
.duo-label {
  font-family: "Noto Serif JP", serif;
  font-weight: 700;
  font-size: 72px;
  color: #f0f0f0;
  margin-bottom: 20px;
}
.duo-role {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 48px;
  color: #c9a84c;
}
.duo-divider {
  width: 4px;
  height: 200px;
  background: linear-gradient(180deg, transparent, #c9a84c, transparent);
}

/* ── Iconography (4 items) ── */
.icon-header {
  font-family: "Noto Serif JP", serif;
  font-weight: 700;
  font-size: 64px;
  color: #f0f0f0;
  margin-bottom: 80px;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 60px;
  max-width: 1500px;
  width: 100%;
}
.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: rgba(18, 18, 30, 0.8);
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 24px;
}
.icon-emoji {
  font-size: 120px;
  margin-bottom: 20px;
}
.icon-label {
  font-family: "Noto Serif JP", serif;
  font-weight: 700;
  font-size: 36px;
  color: #f0f0f0;
}

/* ── Stats ── */
.stats-big {
  font-family: "Noto Serif JP", serif;
  font-weight: 900;
  font-size: 360px;
  background: linear-gradient(180deg, #f0f0f0 0%, #e8c96a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.stats-label {
  font-family: "Noto Serif JP", serif;
  font-weight: 700;
  font-size: 56px;
  color: #f0f0f0;
  margin-top: 20px;
  margin-bottom: 60px;
}
.stats-footer {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 40px;
  color: #c9a84c;
  letter-spacing: 0.05em;
}

/* ── Terminal ── */
.terminal-label {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 700;
  font-size: 42px;
  color: #c9a84c;
  margin-bottom: 30px;
  letter-spacing: 0.1em;
}
.terminal-window {
  background: #0a0a0f;
  border: 2px solid #c9a84c;
  border-radius: 16px;
  padding: 50px 60px;
  width: 100%;
  max-width: 1500px;
  box-shadow: 0 0 40px rgba(201, 168, 76, 0.2);
}
.terminal-window .header {
  display: flex;
  gap: 8px;
  margin-bottom: 30px;
}
.terminal-window .header span {
  width: 14px; height: 14px; border-radius: 50%;
  background: #555;
}
.terminal-content {
  font-family: "JetBrains Mono", "Consolas", monospace;
  font-weight: 600;
  font-size: 36px;
  color: #e8c96a;
  text-align: left;
  white-space: pre-line;
  line-height: 1.7;
}
.terminal-footer {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 32px;
  color: #c9c9d8;
  margin-top: 40px;
  letter-spacing: 0.05em;
}

/* ── Checklist ── */
.checklist-header {
  font-family: "Noto Serif JP", serif;
  font-weight: 900;
  font-size: 80px;
  color: #f0f0f0;
  background: linear-gradient(180deg, #f0f0f0 0%, #e8c96a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 50px;
}
.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1100px;
}
.checklist-item {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 30px 40px;
  background: rgba(18, 18, 30, 0.85);
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: 16px;
  text-align: left;
}
.checklist-checkbox {
  width: 40px; height: 40px;
  border: 3px solid #c9a84c;
  border-radius: 8px;
  flex-shrink: 0;
}
.checklist-text {
  font-family: "Noto Serif JP", serif;
  font-weight: 700;
  font-size: 42px;
  color: #f0f0f0;
}
.checklist-footer {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 32px;
  color: #c9c9d8;
  margin-top: 50px;
  letter-spacing: 0.05em;
}

/* ── Tip card ── */
.tip-num {
  font-family: "Noto Serif JP", serif;
  font-weight: 900;
  font-size: 320px;
  background: linear-gradient(180deg, #f0f0f0 0%, #e8c96a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.tip-text {
  font-family: "Noto Serif JP", serif;
  font-weight: 700;
  font-size: 80px;
  color: #f0f0f0;
  margin: 20px 0 60px;
}
.tip-examples {
  display: flex;
  gap: 50px;
  align-items: stretch;
  width: 100%;
  max-width: 1400px;
}
.tip-example {
  flex: 1;
  padding: 30px 40px;
  border-radius: 16px;
  background: rgba(18, 18, 30, 0.85);
  border: 2px solid;
}
.tip-example.bad { border-color: rgba(239, 68, 68, 0.5); }
.tip-example.good { border-color: rgba(201, 168, 76, 0.7); }
.tip-mark {
  font-family: "Noto Serif JP", serif;
  font-weight: 900;
  font-size: 56px;
  margin-bottom: 14px;
}
.tip-example.bad .tip-mark { color: #ef4444; }
.tip-example.good .tip-mark { color: #c9a84c; }
.tip-example-text {
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 32px;
  color: #f0f0f0;
}

/* ── Chapter pill (top center small label always visible during chapter) ── */
.chapter-pill {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 32px;
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: 999px;
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  font-size: 22px;
  color: #e8c96a;
  letter-spacing: 0.3em;
  z-index: 90;
}
"""


# ─────────────────────────────────────────────────────────────────────────
# テンプレートレンダラー
# ─────────────────────────────────────────────────────────────────────────

def el(scene_id: str, sub: str, track: int, start: float, duration: float, content: str, classes: str = "") -> str:
    """1 つの timeline 要素を生成"""
    return (
        f'<div class="clip {classes}" id="s-{scene_id}-{sub}" '
        f'data-start="{start}" data-duration="{duration}" data-track-index="{track}">'
        f'{content}</div>'
    )


def render_welcome(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="welcome-title serif">{data["title"]}</div>'
        f'  <div class="welcome-subtitle">{data["subtitle"]}</div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.8, ease: "power2.out" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 0.8, ease: "power2.in" }}, {start + dur - 0.8});\n'
    )
    return html, tl


def render_promise(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="promise-pretext">{data["pretext"]}</div>'
        f'  <div class="promise-main">{data["main"]}<span class="accent">{data["main_accent"]}</span>。</div>'
        f'  <div class="promise-post">{data["post"]}</div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, scale: 0.95 }}, {{ opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 0.8, ease: "power2.in" }}, {start + dur - 0.8});\n'
    )
    return html, tl


def render_chapter(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="chapter-num">CHAPTER {data["num"]}</div>'
        f'  <div class="chapter-num-big serif">{data["num"]}</div>'
        f'  <div class="chapter-title">{data["title"]}</div>'
        f'  <div class="chapter-divider"></div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.4)" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, y: -20, duration: 0.7, ease: "power2.in" }}, {start + dur - 0.7});\n'
    )
    return html, tl


def render_comparison(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    left_h = "highlight" if data.get("highlight") == "left" else ""
    right_h = "highlight" if data.get("highlight") == "right" else ""
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="comparison-container">'
        f'    <div class="comparison-card {left_h}">'
        f'      <div class="comparison-label">{data["left_label"]}</div>'
        f'      <div class="comparison-text">{data["left_text"]}</div>'
        f'      <div class="comparison-role">{data["left_role"]}</div>'
        f'    </div>'
        f'    <div class="comparison-card {right_h}">'
        f'      <div class="comparison-label">{data["right_label"]}</div>'
        f'      <div class="comparison-text">{data["right_text"]}</div>'
        f'      <div class="comparison-role">{data["right_role"]}</div>'
        f'    </div>'
        f'  </div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, y: -15, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_statement(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    accent_html = f'<span class="accent">{data["main_accent"]}</span>' if data.get("main_accent") else ""
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="statement-main">{data["main"]}{accent_html}</div>'
        f'  <div class="statement-sub">{data.get("sub", "")}</div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, scale: 0.95 }}, {{ opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.3)" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 0.7, ease: "power2.in" }}, {start + dur - 0.7});\n'
    )
    return html, tl


def render_big_statement(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="big-statement-main serif">{data["main"]}</div>'
        f'  <div class="big-statement-sub">{data.get("sub", "")}</div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, scale: 0.5 }}, {{ opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.6)" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 0.8, ease: "power2.in" }}, {start + dur - 0.8});\n'
    )
    return html, tl


def render_duo(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="duo-container">'
        f'    <div class="duo-side">'
        f'      <div class="duo-label">{data["left_label"]}</div>'
        f'      <div class="duo-role">{data["left_role"]}</div>'
        f'    </div>'
        f'    <div class="duo-divider"></div>'
        f'    <div class="duo-side">'
        f'      <div class="duo-label">{data["right_label"]}</div>'
        f'      <div class="duo-role">{data["right_role"]}</div>'
        f'    </div>'
        f'  </div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_iconography(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    items_html = "".join(
        f'<div class="icon-item"><div class="icon-emoji">{i["icon"]}</div><div class="icon-label">{i["label"]}</div></div>'
        for i in data["items"]
    )
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="icon-header serif">{data["header"]}</div>'
        f'  <div class="icon-grid">{items_html}</div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_stats(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="stats-big serif">{data["big"]}</div>'
        f'  <div class="stats-label">{data["label"]}</div>'
        f'  <div class="stats-footer">{data["footer"]}</div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, scale: 0.6 }}, {{ opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.5)" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 0.8, ease: "power2.in" }}, {start + dur - 0.8});\n'
    )
    return html, tl


def render_terminal(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    lines = "\n".join(data["lines"])
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="terminal-label">{data["label"]}</div>'
        f'  <div class="terminal-window">'
        f'    <div class="header"><span></span><span></span><span></span></div>'
        f'    <div class="terminal-content">{lines}</div>'
        f'  </div>'
        f'  <div class="terminal-footer">{data["footer"]}</div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_terminal_cmd(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="terminal-label">{data["label"]}</div>'
        f'  <div class="terminal-window">'
        f'    <div class="header"><span></span><span></span><span></span></div>'
        f'    <div class="terminal-content">{data["command"]}</div>'
        f'  </div>'
        f'  <div class="terminal-footer">{data["footer"]}</div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_checklist(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    items_html = "".join(
        f'<div class="checklist-item"><div class="checklist-checkbox"></div><div class="checklist-text">{item}</div></div>'
        for item in data["items"]
    )
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="checklist-header serif">{data["header"]}</div>'
        f'  <div class="checklist-items">{items_html}</div>'
        f'  <div class="checklist-footer">{data["footer"]}</div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_tip(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="tip-num serif">{data["num"]}</div>'
        f'  <div class="tip-text serif">{data["tip"]}</div>'
        f'  <div class="tip-examples">'
        f'    <div class="tip-example bad"><div class="tip-mark">✗</div><div class="tip-example-text">{data["bad"]}</div></div>'
        f'    <div class="tip-example good"><div class="tip-mark">✓</div><div class="tip-example-text">{data["good"]}</div></div>'
        f'  </div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0, scale: 0.92 }}, {{ opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 0.5, ease: "power2.in" }}, {start + dur - 0.5});\n'
    )
    return html, tl


def render_closing(s_id: str, start: float, dur: float, data: dict, track_base: int) -> tuple[str, str]:
    accent_html = f'<span class="accent">{data["main_accent"]}</span>' if data.get("main_accent") else ""
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene">'
        f'  <div class="statement-main">{data["main"]}{accent_html}</div>'
        f'  <div class="statement-sub">{data.get("sub", "")}</div>'
        f'</div>',
    )
    tl = (
        f'tl.fromTo("#s-{s_id}-scene", {{ opacity: 0 }}, {{ opacity: 1, duration: 1.2, ease: "power2.out" }}, {start});\n'
        f'tl.to("#s-{s_id}-scene", {{ opacity: 0, duration: 1.5, ease: "power2.in" }}, {start + dur - 1.5});\n'
    )
    return html, tl


RENDERERS: dict[str, Callable] = {
    "welcome": render_welcome,
    "promise": render_promise,
    "chapter": render_chapter,
    "comparison": render_comparison,
    "statement": render_statement,
    "big_statement": render_big_statement,
    "duo": render_duo,
    "iconography": render_iconography,
    "stats": render_stats,
    "terminal": render_terminal,
    "terminal_cmd": render_terminal_cmd,
    "checklist": render_checklist,
    "tip": render_tip,
    "closing": render_closing,
}


# ─────────────────────────────────────────────────────────────────────────
# メイン: HTML 全体を組み立て
# ─────────────────────────────────────────────────────────────────────────

def build() -> str:
    scene_html_parts: list[str] = []
    timeline_parts: list[str] = []
    audio_html_parts: list[str] = []

    for i, (scene_id, start, max_dur, _text) in enumerate(WEEK01_MAIN_SCENES):
        visual = SCENE_VISUAL.get(scene_id)
        if not visual:
            print(f"WARN: no visual data for scene {scene_id}")
            continue

        renderer = RENDERERS.get(visual["type"])
        if not renderer:
            print(f"WARN: no renderer for type {visual['type']}")
            continue

        track = SCENE_TRACK_BASE + i * TRACKS_PER_SCENE
        html, tl = renderer(scene_id, start, max_dur, visual, track)
        scene_html_parts.append(html)
        timeline_parts.append(tl)

        # オーディオタグ
        audio_path = f"assets/main_lesson_scenes/week01_{scene_id.replace('-', '_')}.wav"
        audio_track = AUDIO_TRACK_BASE + i
        # data-duration はシーン尺と同じにする (音声が短ければ自然と終わる)
        audio_html_parts.append(
            f'<audio class="clip" id="a-{scene_id}" '
            f'data-start="{start}" data-duration="{max_dur}" data-track-index="{audio_track}" '
            f'data-volume="1.0" src="{audio_path}"></audio>'
        )

    scene_html = "\n      ".join(scene_html_parts)
    audio_html = "\n      ".join(audio_html_parts)
    timeline_js = "      ".join(timeline_parts)

    return f"""<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={WIDTH}, height={HEIGHT}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Noto+Serif+JP:wght@400;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>{CSS}</style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL_DURATION}" data-width="{WIDTH}" data-height="{HEIGHT}">

      <!-- Background (always visible) -->
      <div class="clip bg-base" id="bg-base" data-start="0" data-duration="{TOTAL_DURATION}" data-track-index="0"></div>
      <div class="clip bg-glow" id="bg-glow" data-start="0" data-duration="{TOTAL_DURATION}" data-track-index="1"></div>
      <div class="clip bg-vignette" id="bg-vignette" data-start="0" data-duration="{TOTAL_DURATION}" data-track-index="2"></div>

      <!-- Brand badge (visible from 0:30 onward, after opening) -->
      <div class="clip brand-badge" id="brand-badge" data-start="30" data-duration="{TOTAL_DURATION - 30}" data-track-index="3">
        <div class="dot"></div>
        <div class="text">AI Builders Lab</div>
      </div>

      <!-- ═══════════ Scenes ═══════════ -->
      {scene_html}

      <!-- ═══════════ Audio ═══════════ -->
      {audio_html}

    </div>

    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});

      // Background subtle pulse
      tl.to("#bg-glow", {{ scale: 1.06, opacity: 0.85, duration: 5, repeat: 60, yoyo: true, ease: "sine.inOut" }}, 0);

      // Brand badge fade-in
      tl.fromTo("#brand-badge", {{ opacity: 0, x: 20 }}, {{ opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }}, 30);

      // Scenes
      {timeline_js}

      tl.to({{}}, {{ duration: 0.01 }}, {TOTAL_DURATION});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    html = build()
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"OK: {OUTPUT} ({len(html):,} bytes, {len(WEEK01_MAIN_SCENES)} scenes)")


if __name__ == "__main__":
    main()
