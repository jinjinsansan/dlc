"""Week 8 本編 visual"""

SCENE_VISUAL: dict[str, dict] = {
    "O1": {"type": "welcome", "title": "ようこそ。", "subtitle": "Week 8 — お客さんを集めて稼ぐ"},
    "O2": {"type": "promise", "pretext": "「作っただけ」では、誰も来ない。", "main": "集客と、", "main_accent": "マーケティング", "post": "ラスト・ピース。"},

    "1-1": {"type": "chapter", "num": "1", "title": "集客の、全体像"},
    "1-2": {"type": "iconography", "header": "個人開発の集客 4 経路", "items": [
        {"icon": "𝕏", "label": "X 発信"},
        {"icon": "📝", "label": "note"},
        {"icon": "🔍", "label": "SEO"},
        {"icon": "🤝", "label": "紹介"},
    ]},
    "1-3": {"type": "stats", "big": "10 → 100", "label": "最初は手動、その後システム化", "footer": "10 人までは自分の足で。100 人で回り始める。"},

    "2-1": {"type": "chapter", "num": "2", "title": "X で、告知する"},
    "2-2": {"type": "checklist", "header": "X プロフィール最適化", "items": ["プロフィールにサービス URL", "固定ツイートに紹介", "ヘッダー画像にも導線"], "footer": "ここまで 10 分"},
    "2-3": {"type": "terminal_cmd", "label": "Claude に書いてもらう", "command": "> サービス紹介ツイートを 5 パターン:\n  ① エモーショナル\n  ② 機能重視\n  ③ お得感\n  ④ ユーザーの声風\n  ⑤ ストーリー",
            "footer": "瞬時に 5 つの切り口で生成"},

    "3-1": {"type": "chapter", "num": "3", "title": "note で、深い記事"},
    "3-2": {"type": "iconography", "header": "note は長文 + 信頼", "items": [
        {"icon": "📖", "label": "ストーリー"},
        {"icon": "🛠", "label": "技術選定"},
        {"icon": "💭", "label": "苦労"},
        {"icon": "💡", "label": "解決"},
    ]},
    "3-3": {"type": "terminal_cmd", "label": "テンプレで骨格", "command": "> note 記事テンプレートを使って\n  2,000 字でストーリーを書いて。\n  私のサービスはこれで、\n  こういう経緯で生まれた。",
            "footer": "編集だけで完成"},

    "4-1": {"type": "chapter", "num": "4", "title": "AI 自動投稿の、仕組み"},
    "4-2": {"type": "terminal_cmd", "label": "X 自動投稿 Bot", "command": "> X に毎日 1 投稿する Bot を作って。\n  AI が日替わりで投稿内容を生成、\n  X API で 朝 9 時に投稿。",
            "footer": "寝ている間も集客される"},
    "4-3": {"type": "big_statement", "main": "完全自動化。", "sub": "Claude Code で投稿サイクルを構築。"},

    "5-1": {"type": "chapter", "num": "5", "title": "最初の 1 人を、獲得する"},
    "5-2": {"type": "checklist", "header": "10 人にダイレクトに声をかける", "items": ["コミュニティの仲間", "家族・知人", "X のフォロワー"], "footer": "「使ってみて、フィードバック欲しい」"},
    "5-3": {"type": "big_statement", "main": "「使ってくれた…！」", "sub": "8 週間で、もっとも幸福な瞬間。"},

    "6-1": {"type": "chapter", "num": "6", "title": "卒業後の、ロードマップ"},
    "6-2": {"type": "stats", "big": "¥15,000", "label": "/ 月 (有料 10 人 × ¥1,500)", "footer": "卒業後 6 ヶ月の到達点"},
    "6-3": {"type": "stats", "big": "¥100,000", "label": "/ 月 (1 年後の現実的目標)", "footer": "3 年後、本業超えが視野に入る"},

    "7-1": {"type": "chapter", "num": "7", "title": "8 週間後の、あなた"},
    "7-2": {"type": "big_statement", "main": "奇跡ではなく、必然。", "sub": "コードを書けないと諦めていた 8 週間前の自分が、嘘のよう。"},

    "8-1": {"type": "checklist", "header": "最終回の宿題", "items": ["最初の有料ユーザーを獲得", "感動の声をコミュニティに投稿", "次の挑戦を宣言"], "footer": "仲間が一緒に祝う"},
    "8-2": {"type": "closing", "main": "ありがとう、", "main_accent": "また会おう", "sub": "卒業生コミュニティで。あなたは、もう作れる人。"},
}
