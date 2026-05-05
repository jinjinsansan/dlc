"""
Week N 本編動画用の HTML composition を生成する (--week 引数で切替可能)。

Usage:
  python build_main_lesson_html.py --week 1
  python build_main_lesson_html.py --week 2
  ...

audio/main_lesson_scenes/weekNN_data.py + weekNN_visual.py を読み、
week0N-main/index.html を出力。
"""

from __future__ import annotations

import argparse
import importlib
import sys
from pathlib import Path
from typing import Callable

ROOT = Path(__file__).parent
SCENES_DIR = ROOT / "audio" / "main_lesson_scenes"
sys.path.insert(0, str(SCENES_DIR))

WIDTH = 1920
HEIGHT = 1080

# トラック割当
SCENE_TRACK_BASE = 10
TRACKS_PER_SCENE = 6
AUDIO_TRACK_BASE = 200


# ─────────────────────────────────────────────────────────────────────────
# CSS (全テンプレート共通)
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

/* ── Scene container (full-viewport, centered) ── */
.scene {
  position: fixed;
  top: 0; left: 0;
  width: 1920px; height: 1080px;
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

/* ── Comparison ── */
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
.comparison-card.highlight .comparison-label { color: #e8c96a; }
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

/* ── Duo ── */
.duo-container { display: flex; gap: 80px; align-items: center; justify-content: center; }
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
  width: 4px; height: 200px;
  background: linear-gradient(180deg, transparent, #c9a84c, transparent);
}

/* ── Iconography ── */
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
  display: flex; flex-direction: column; align-items: center;
  padding: 40px;
  background: rgba(18, 18, 30, 0.8);
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 24px;
}
.icon-emoji { font-size: 120px; margin-bottom: 20px; }
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
  display: flex; gap: 8px; margin-bottom: 30px;
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
  display: flex; flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1100px;
}
.checklist-item {
  display: flex; align-items: center; gap: 30px;
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
  display: flex; gap: 50px; align-items: stretch;
  width: 100%; max-width: 1400px;
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
"""


# ─────────────────────────────────────────────────────────────────────────
# テンプレートレンダラー
# ─────────────────────────────────────────────────────────────────────────

def el(scene_id: str, sub: str, track: int, start: float, duration: float, content: str, classes: str = "") -> str:
    safe_id = scene_id.replace("-", "_")
    return (
        f'<div class="clip {classes}" id="s-{safe_id}-{sub}" '
        f'data-start="{start}" data-duration="{duration}" data-track-index="{track}">'
        f'{content}</div>'
    )


def _id(scene_id: str) -> str:
    return scene_id.replace("-", "_")


def render_welcome(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="welcome-title serif">{data["title"]}</div>'
        f'<div class="welcome-subtitle">{data["subtitle"]}</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.8, ease: "power2.out" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 0.8, ease: "power2.in" }}, {start + dur - 0.8});\n'
    )
    return html, tl


def render_promise(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="promise-pretext">{data["pretext"]}</div>'
        f'<div class="promise-main">{data["main"]}<span class="accent">{data["main_accent"]}</span>。</div>'
        f'<div class="promise-post">{data["post"]}</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, scale: 0.95 }}, {{ opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 0.8, ease: "power2.in" }}, {start + dur - 0.8});\n'
    )
    return html, tl


def render_chapter(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="chapter-num">CHAPTER {data["num"]}</div>'
        f'<div class="chapter-num-big serif">{data["num"]}</div>'
        f'<div class="chapter-title">{data["title"]}</div>'
        f'<div class="chapter-divider"></div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.4)" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, y: -20, duration: 0.7, ease: "power2.in" }}, {start + dur - 0.7});\n'
    )
    return html, tl


def render_comparison(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    left_h = "highlight" if data.get("highlight") == "left" else ""
    right_h = "highlight" if data.get("highlight") == "right" else ""
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="comparison-container">'
        f'<div class="comparison-card {left_h}"><div class="comparison-label">{data["left_label"]}</div>'
        f'<div class="comparison-text">{data["left_text"]}</div>'
        f'<div class="comparison-role">{data["left_role"]}</div></div>'
        f'<div class="comparison-card {right_h}"><div class="comparison-label">{data["right_label"]}</div>'
        f'<div class="comparison-text">{data["right_text"]}</div>'
        f'<div class="comparison-role">{data["right_role"]}</div></div>'
        f'</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, y: -15, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_statement(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    accent_html = f'<span class="accent">{data["main_accent"]}</span>' if data.get("main_accent") else ""
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="statement-main">{data["main"]}{accent_html}</div>'
        f'<div class="statement-sub">{data.get("sub", "")}</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, scale: 0.95 }}, {{ opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.3)" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 0.7, ease: "power2.in" }}, {start + dur - 0.7});\n'
    )
    return html, tl


def render_big_statement(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="big-statement-main serif">{data["main"]}</div>'
        f'<div class="big-statement-sub">{data.get("sub", "")}</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, scale: 0.5 }}, {{ opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.6)" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 0.8, ease: "power2.in" }}, {start + dur - 0.8});\n'
    )
    return html, tl


def render_duo(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="duo-container">'
        f'<div class="duo-side"><div class="duo-label">{data["left_label"]}</div>'
        f'<div class="duo-role">{data["left_role"]}</div></div>'
        f'<div class="duo-divider"></div>'
        f'<div class="duo-side"><div class="duo-label">{data["right_label"]}</div>'
        f'<div class="duo-role">{data["right_role"]}</div></div>'
        f'</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_iconography(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    items_html = "".join(
        f'<div class="icon-item"><div class="icon-emoji">{i["icon"]}</div><div class="icon-label">{i["label"]}</div></div>'
        for i in data["items"]
    )
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="icon-header serif">{data["header"]}</div>'
        f'<div class="icon-grid">{items_html}</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_stats(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="stats-big serif">{data["big"]}</div>'
        f'<div class="stats-label">{data["label"]}</div>'
        f'<div class="stats-footer">{data["footer"]}</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, scale: 0.6 }}, {{ opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.5)" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 0.8, ease: "power2.in" }}, {start + dur - 0.8});\n'
    )
    return html, tl


def render_terminal(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    lines = "\n".join(data["lines"])
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="terminal-label">{data["label"]}</div>'
        f'<div class="terminal-window"><div class="header"><span></span><span></span><span></span></div>'
        f'<div class="terminal-content">{lines}</div></div>'
        f'<div class="terminal-footer">{data["footer"]}</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_terminal_cmd(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="terminal-label">{data["label"]}</div>'
        f'<div class="terminal-window"><div class="header"><span></span><span></span><span></span></div>'
        f'<div class="terminal-content">{data["command"]}</div></div>'
        f'<div class="terminal-footer">{data["footer"]}</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_checklist(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    items_html = "".join(
        f'<div class="checklist-item"><div class="checklist-checkbox"></div><div class="checklist-text">{item}</div></div>'
        for item in data["items"]
    )
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="checklist-header serif">{data["header"]}</div>'
        f'<div class="checklist-items">{items_html}</div>'
        f'<div class="checklist-footer">{data["footer"]}</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 0.6, ease: "power2.in" }}, {start + dur - 0.6});\n'
    )
    return html, tl


def render_tip(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="tip-num serif">{data["num"]}</div>'
        f'<div class="tip-text serif">{data["tip"]}</div>'
        f'<div class="tip-examples">'
        f'<div class="tip-example bad"><div class="tip-mark">✗</div><div class="tip-example-text">{data["bad"]}</div></div>'
        f'<div class="tip-example good"><div class="tip-mark">✓</div><div class="tip-example-text">{data["good"]}</div></div>'
        f'</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0, scale: 0.92 }}, {{ opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 0.5, ease: "power2.in" }}, {start + dur - 0.5});\n'
    )
    return html, tl


def render_closing(s_id, start, dur, data, track_base):
    sid = _id(s_id)
    accent_html = f'<span class="accent">{data["main_accent"]}</span>' if data.get("main_accent") else ""
    html = el(s_id, "scene", track_base, start, dur,
        f'<div class="scene"><div class="statement-main">{data["main"]}{accent_html}</div>'
        f'<div class="statement-sub">{data.get("sub", "")}</div></div>')
    tl = (
        f'tl.fromTo("#s-{sid}-scene", {{ opacity: 0 }}, {{ opacity: 1, duration: 1.2, ease: "power2.out" }}, {start});\n'
        f'tl.to("#s-{sid}-scene", {{ opacity: 0, duration: 1.5, ease: "power2.in" }}, {start + dur - 1.5});\n'
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
# 動的読み込み
# ─────────────────────────────────────────────────────────────────────────

def load_week(week_num: int) -> tuple[list, dict, float]:
    """指定 week のデータをロード"""
    data_module = importlib.import_module(f"week{week_num:02d}_data")
    visual_module = importlib.import_module(f"week{week_num:02d}_visual")

    var_name = f"WEEK{week_num:02d}_MAIN_SCENES"
    scenes = getattr(data_module, var_name)
    visual = getattr(visual_module, "SCENE_VISUAL")
    total = getattr(data_module, "TOTAL_DURATION", 600.0)
    return scenes, visual, total


def build(week_num: int) -> str:
    scenes, visual_data, total_duration = load_week(week_num)

    scene_html_parts: list[str] = []
    timeline_parts: list[str] = []
    audio_html_parts: list[str] = []

    for i, (scene_id, start, max_dur, _text) in enumerate(scenes):
        visual = visual_data.get(scene_id)
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

        audio_path = f"assets/main_lesson_scenes/week{week_num:02d}_{scene_id.replace('-', '_')}.wav"
        audio_track = AUDIO_TRACK_BASE + i
        audio_html_parts.append(
            f'<audio class="clip" id="a-{scene_id.replace("-", "_")}" '
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
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total_duration}" data-width="{WIDTH}" data-height="{HEIGHT}">

      <div class="clip bg-base" id="bg-base" data-start="0" data-duration="{total_duration}" data-track-index="0"></div>
      <div class="clip bg-glow" id="bg-glow" data-start="0" data-duration="{total_duration}" data-track-index="1"></div>
      <div class="clip bg-vignette" id="bg-vignette" data-start="0" data-duration="{total_duration}" data-track-index="2"></div>

      <div class="clip brand-badge" id="brand-badge" data-start="30" data-duration="{total_duration - 30}" data-track-index="3">
        <div class="dot"></div>
        <div class="text">AI Builders Lab</div>
      </div>

      {scene_html}

      {audio_html}

    </div>

    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});

      tl.to("#bg-glow", {{ scale: 1.06, opacity: 0.85, duration: 5, repeat: 60, yoyo: true, ease: "sine.inOut" }}, 0);
      tl.fromTo("#brand-badge", {{ opacity: 0, x: 20 }}, {{ opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }}, 30);

      {timeline_js}

      tl.to({{}}, {{ duration: 0.01 }}, {total_duration});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--week", type=int, required=True, help="Week number (1-8)")
    args = parser.parse_args()

    output = ROOT / f"week{args.week:02d}-main" / "index.html"
    output.parent.mkdir(parents=True, exist_ok=True)

    html = build(args.week)
    output.write_text(html, encoding="utf-8")
    print(f"OK: {output} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
