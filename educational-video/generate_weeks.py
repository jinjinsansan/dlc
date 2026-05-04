"""
AI Builders Lab — Week 2〜8 イントロ動画生成スクリプト

Week 1 (week01-intro/index.html) をテンプレートとして、
各週固有のテキストを置換した index.html / meta.json を生成する。
"""

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
TEMPLATE_DIR = ROOT / "week01-intro"
TEMPLATE_HTML = (TEMPLATE_DIR / "index.html").read_text(encoding="utf-8")


# ─────────────────────────────────────────────────────────────────────────────
# 各 Week のコンテンツ定義
# ─────────────────────────────────────────────────────────────────────────────

WEEKS = {
    2: {
        "title_jp": "日本語だけでWebページを作る",
        "title_jp_accent": "Webページ",
        "hook_line1": "あなたの名前で、",
        "hook_line2_main": "Webサイトを",
        "hook_line2_accent": "持つ",
        "tagline": "B U I L D &nbsp;・&nbsp; A R R A N G E &nbsp;・&nbsp; S H A R E",
        "steps_header_pre": "今週で",
        "steps_header_accent": "出来上がる",
        "steps_header_post": "もの",
        "step1": ("構成決め", "5 分"),
        "step2": ("AI に頼む", "10 分"),
        "step3": ("自分の作品", "20 分"),
        "steps_bottom": "・ ページ数は自由、内容も自由 ・",
        "promise_pretext": "完成した瞬間、あなたは",
        "promise_quote": "「自分のサイトだ…！」",
        "promise_after": "と、画面の中の作品にしばらく見惚れる。",
        "cta_main_pre": "さあ、",
        "cta_main_accent": "作ろう",
    },
    3: {
        "title_jp": "デザインをAIに注文する",
        "title_jp_accent": "デザイン",
        "hook_line1": "「プロっぽい」は、",
        "hook_line2_main": "5 分で",
        "hook_line2_accent": "手に入る",
        "tagline": "T O N E &nbsp;・&nbsp; C O L O R &nbsp;・&nbsp; M O T I O N",
        "steps_header_pre": "今週で",
        "steps_header_accent": "プロ品質",
        "steps_header_post": "に化ける",
        "step1": ("トーン選定", "5 分"),
        "step2": ("一括お願い", "5 分"),
        "step3": ("スマホ対応", "5 分"),
        "steps_bottom": "・ センスは、いらない ・",
        "promise_pretext": "仕上がった画面に、あなたは",
        "promise_quote": "「これ、自分が…？」",
        "promise_after": "と、人に URL を送りたくなる衝動を抑える。",
        "cta_main_pre": "さあ、",
        "cta_main_accent": "磨こう",
    },
    4: {
        "title_jp": "機能を言葉で追加する",
        "title_jp_accent": "機能",
        "hook_line1": "ただのページが、",
        "hook_line2_main": "動くアプリに",
        "hook_line2_accent": "化ける",
        "tagline": "D A T A &nbsp;・&nbsp; L O G I N &nbsp;・&nbsp; M E M B E R",
        "steps_header_pre": "今週で",
        "steps_header_accent": "本物のアプリ",
        "steps_header_post": "になる",
        "step1": ("Supabase", "30 分"),
        "step2": ("ログイン", "20 分"),
        "step3": ("マイページ", "15 分"),
        "steps_bottom": "・ DB が、本当にあなたを覚える ・",
        "promise_pretext": "管理画面を見た瞬間、あなたは",
        "promise_quote": "「保存された…！」",
        "promise_after": "と、自分のデータが宿った事実に静かに震える。",
        "cta_main_pre": "さあ、",
        "cta_main_accent": "動かそう",
    },
    5: {
        "title_jp": "AIの力をアプリに入れる",
        "title_jp_accent": "AI の力",
        "hook_line1": "あなたのアプリに、",
        "hook_line2_main": "AI を",
        "hook_line2_accent": "住まわせる",
        "tagline": "A P I &nbsp;・&nbsp; C H A T &nbsp;・&nbsp; S O U L",
        "steps_header_pre": "今週で",
        "steps_header_accent": "他にない武器",
        "steps_header_post": "を持つ",
        "step1": ("API キー", "10 分"),
        "step2": ("AI 機能", "15 分"),
        "step3": ("キャラ付け", "5 分"),
        "steps_bottom": "・ 世にあるサービスから、抜きん出る ・",
        "promise_pretext": "AI が応答した瞬間、あなたは",
        "promise_quote": "「答えてくれた…！」",
        "promise_after": "と、自分のアプリの中で AI が動く事実に鳥肌が立つ。",
        "cta_main_pre": "さあ、",
        "cta_main_accent": "賢くしよう",
    },
    6: {
        "title_jp": "完成させて世界に公開する",
        "title_jp_accent": "世界に公開",
        "hook_line1": "あなたの URL が、",
        "hook_line2_main": "世界に",
        "hook_line2_accent": "生まれる",
        "tagline": "G I T H U B &nbsp;・&nbsp; V E R C E L &nbsp;・&nbsp; L I V E",
        "steps_header_pre": "今週で",
        "steps_header_accent": "世界中からアクセス可能",
        "steps_header_post": "になる",
        "step1": ("GitHub", "10 分"),
        "step2": ("Vercel", "15 分"),
        "step3": ("URL 発行", "5 分"),
        "steps_bottom": "・ あなたのサービスが、世に出る ・",
        "promise_pretext": "URL を送った友達から、あなたは",
        "promise_quote": "「これ、すごい…！」",
        "promise_after": "という返事が届き、画面の前で泣きそうになる。",
        "cta_main_pre": "さあ、",
        "cta_main_accent": "公開しよう",
    },
    7: {
        "title_jp": "お金を受け取れるようにする",
        "title_jp_accent": "お金を受け取る",
        "hook_line1": "趣味から、ビジネスへ。",
        "hook_line2_main": "一線を、",
        "hook_line2_accent": "越える",
        "tagline": "S T R I P E &nbsp;・&nbsp; S U B S C R I P T I O N &nbsp;・&nbsp; B I L L I N G",
        "steps_header_pre": "今週で",
        "steps_header_accent": "お金を受け取れる",
        "steps_header_post": "状態になる",
        "step1": ("Stripe", "15 分"),
        "step2": ("決済組込", "30 分"),
        "step3": ("テスト決済", "15 分"),
        "steps_bottom": "・ 給料以外で、初めて稼ぐ準備 ・",
        "promise_pretext": "テスト決済が成功した瞬間、あなたは",
        "promise_quote": "「通った…！」",
        "promise_after": "と、自分が市場から価値を受け取る扉に立つ。",
        "cta_main_pre": "さあ、",
        "cta_main_accent": "稼ごう",
    },
    8: {
        "title_jp": "お客さんを集めて稼ぐ",
        "title_jp_accent": "お客さん",
        "hook_line1": "最初の 1 人のお客さんと、",
        "hook_line2_main": "本当に",
        "hook_line2_accent": "出会う",
        "tagline": "S O C I A L &nbsp;・&nbsp; S T O R Y &nbsp;・&nbsp; F I R S T &nbsp; U S E R",
        "steps_header_pre": "今週で",
        "steps_header_accent": "最初のユーザー",
        "steps_header_post": "を獲得する",
        "step1": ("プロフ整備", "10 分"),
        "step2": ("リリース告知", "10 分"),
        "step3": ("1 人目獲得", "数日"),
        "steps_bottom": "・ 作っただけでは、誰も来ない ・",
        "promise_pretext": "知らない人の通知を見て、あなたは",
        "promise_quote": "「使ってくれた…！」",
        "promise_after": "と、世界と自分の作品が繋がった瞬間に立ち会う。",
        "cta_main_pre": "さあ、",
        "cta_main_accent": "届けよう",
    },
}


# ─────────────────────────────────────────────────────────────────────────────
# 置換ロジック
# ─────────────────────────────────────────────────────────────────────────────

def render_week(week_num: int, data: dict) -> str:
    """Week 1 テンプレートから当該 Week 用の HTML を生成"""
    html = TEMPLATE_HTML

    # ── Hook (Scene 1) ──
    html = html.replace(
        "コードを 1 行も書かずに、",
        data["hook_line1"],
    )
    html = html.replace(
        '本物のアプリを<span class="accent">作る</span>。',
        f'{data["hook_line2_main"]}<span class="accent">{data["hook_line2_accent"]}</span>。',
    )

    # ── Title (Scene 2) ──
    week_label = f"WEEK 0{week_num}"
    html = html.replace("WEEK 01", week_label)

    # Week number (only the standalone "1" inside week-number div)
    html = html.replace(
        '<div class="clip week-number" id="week-number" data-start="4.2" data-duration="4.8" data-track-index="8">\n        1\n      </div>',
        f'<div class="clip week-number" id="week-number" data-start="4.2" data-duration="4.8" data-track-index="8">\n        {week_num}\n      </div>',
    )

    html = html.replace(
        'はじめての <span style="color:#e8c96a">Claude Code</span>',
        data["title_jp"].replace(
            data["title_jp_accent"],
            f'<span style="color:#e8c96a">{data["title_jp_accent"]}</span>',
        ),
    )

    html = html.replace(
        "I N S T A L L &nbsp;・&nbsp; F I R S T &nbsp; A P P",
        data["tagline"],
    )

    # ── Scene 3: 3 Steps Header ──
    html = html.replace(
        '今週で<span class="accent">出来るようになる</span>こと',
        f'{data["steps_header_pre"]}<span class="accent">{data["steps_header_accent"]}</span>{data["steps_header_post"]}',
    )

    # ── Scene 3: 3 Step Cards ──
    html = html.replace(
        '<div class="step-num">1</div>\n          <div class="step-title">インストール</div>\n          <div class="step-time">5 分</div>',
        f'<div class="step-num">1</div>\n          <div class="step-title">{data["step1"][0]}</div>\n          <div class="step-time">{data["step1"][1]}</div>',
    )
    html = html.replace(
        '<div class="step-num">2</div>\n          <div class="step-title">話しかける</div>\n          <div class="step-time">10 分</div>',
        f'<div class="step-num">2</div>\n          <div class="step-title">{data["step2"][0]}</div>\n          <div class="step-time">{data["step2"][1]}</div>',
    )
    html = html.replace(
        '<div class="step-num">3</div>\n          <div class="step-title">アプリ完成</div>\n          <div class="step-time">15 分</div>',
        f'<div class="step-num">3</div>\n          <div class="step-title">{data["step3"][0]}</div>\n          <div class="step-time">{data["step3"][1]}</div>',
    )

    html = html.replace(
        "・ コードを 1 行も書かずに ・",
        data["steps_bottom"],
    )

    # ── Scene 4: Promise ──
    html = html.replace("30 分後、あなたは", data["promise_pretext"])
    html = html.replace(
        '<span class="accent">「動いた…！」</span>',
        f'<span class="accent">{data["promise_quote"]}</span>',
    )
    html = html.replace(
        "と、目の前のアプリに感動している。",
        data["promise_after"],
    )

    # ── Scene 5: CTA ──
    html = html.replace(
        'さあ、<span class="accent">始めよう</span>。',
        f'{data["cta_main_pre"]}<span class="accent">{data["cta_main_accent"]}</span>。',
    )

    # CTA bottom: "WEEK 01" → "WEEK 0N"
    html = html.replace(
        f'W E E K &nbsp; 0 1 &nbsp;&nbsp; <span class="blink">▶</span>',
        f'W E E K &nbsp; 0{week_num} &nbsp;&nbsp; <span class="blink">▶</span>',
    )

    return html


def main() -> None:
    for week_num, data in WEEKS.items():
        dir_name = f"week0{week_num}-intro"
        target_dir = ROOT / dir_name

        # Reset + copy template
        if target_dir.exists():
            shutil.rmtree(target_dir)
        shutil.copytree(TEMPLATE_DIR, target_dir, ignore=shutil.ignore_patterns("renders"))

        # Generate index.html
        html = render_week(week_num, data)
        (target_dir / "index.html").write_text(html, encoding="utf-8")

        # Update meta.json
        meta = json.loads((TEMPLATE_DIR / "meta.json").read_text(encoding="utf-8"))
        meta["id"] = dir_name
        meta["name"] = dir_name
        (target_dir / "meta.json").write_text(
            json.dumps(meta, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

        # Update package.json name
        pkg_path = target_dir / "package.json"
        pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
        pkg["name"] = dir_name
        pkg_path.write_text(json.dumps(pkg, ensure_ascii=False, indent=2), encoding="utf-8")

        print(f"OK: Generated {dir_name}")


if __name__ == "__main__":
    main()
