"""
Week 2 本編動画のシーン別ビジュアルデータ。
build_main_lesson_html.py のテンプレートに渡す内容。
"""

SCENE_VISUAL: dict[str, dict] = {
    # オープニング
    "O1": {
        "type": "welcome",
        "title": "ようこそ。",
        "subtitle": "Week 2 — 日本語だけで Web ページを作る",
    },
    "O2": {
        "type": "promise",
        "pretext": "今週、あなたは。",
        "main": "本物の Web サイトを、",
        "main_accent": "作る",
        "post": "コードは、1 行も書かない。",
    },

    # 第1章: 何を作るか決める
    "1-1": {"type": "chapter", "num": "1", "title": "何を作るか、決めよう"},
    "1-2": {
        "type": "iconography",
        "header": "おすすめは、自己紹介サイト",
        "items": [
            {"icon": "👤", "label": "自己紹介"},
            {"icon": "🛍️", "label": "サービス LP"},
            {"icon": "📝", "label": "ブログ"},
            {"icon": "🎨", "label": "ポートフォリオ"},
        ],
    },
    "1-3": {
        "type": "statement",
        "main": "迷ったら、",
        "main_accent": "自己紹介サイト",
        "sub": "作りやすく、Web の基本が身につき、卒業後にも使える。",
    },

    # 第2章: AIに頼む
    "2-1": {"type": "chapter", "num": "2", "title": "AI に頼んで、Web サイトを作る"},
    "2-2": {
        "type": "terminal_cmd",
        "label": "作業フォルダを作って起動",
        "command": "$ cd ~/my-apps\n$ mkdir my-website\n$ cd my-website\n$ claude\n>",
        "footer": "毎回この流れで Claude Code を起動",
    },
    "2-3": {
        "type": "terminal_cmd",
        "label": "練習: カフェのサイトを作る",
        "command": "> おしゃれなカフェの紹介サイトを作って。\n  トップ・メニュー・店舗情報・\n  お問い合わせの 4 ページで。",
        "footer": "1 文で、4 ページのサイトが生まれる",
    },
    "2-4": {
        "type": "statement",
        "main": "1〜2 分で、",
        "main_accent": "完成",
        "sub": "Claude Code が必要なファイルを自動生成し、デザインも整えてくれる。",
    },

    # 第3章: ブラウザ確認
    "3-1": {"type": "chapter", "num": "3", "title": "ブラウザで、確認する"},
    "3-2": {
        "type": "checklist",
        "header": "ブラウザで開く",
        "items": [
            "Finder/エクスプローラを開く",
            "index.html を見つける",
            "ダブルクリック",
        ],
        "footer": "ブラウザが起動 → サイトが表示される",
    },
    "3-3": {
        "type": "big_statement",
        "main": "見えた。",
        "sub": "あなたが一言で作ったサイトが、画面に映っている。",
    },

    # 第4章: 内容を変更
    "4-1": {"type": "chapter", "num": "4", "title": "自分のサイトに、育てる"},
    "4-2": {
        "type": "terminal_cmd",
        "label": "全体を書き換える",
        "command": "> このサイトを、私の自己紹介サイトに変えて。\n  名前: 山田太郎\n  職業: AI 個人開発者\n  趣味: カフェ巡り",
        "footer": "サイト全体が、自分仕様に書き変わる",
    },
    "4-3": {
        "type": "tip",
        "num": "🛠",
        "tip": "部分修正のコツ",
        "bad": "「全体的に変えて」",
        "good": "「店名を私の名前に変えて」",
    },
    "4-4": {
        "type": "terminal_cmd",
        "label": "文章も AI が書く",
        "command": "> 自己紹介を、温かみのある感じで\n  3 段落書いて。\n  私は元営業マンで…",
        "footer": "気に入らなければ「もっとカジュアルに」など修正",
    },

    # 第5章: ページを増やす
    "5-1": {"type": "chapter", "num": "5", "title": "ページを、増やす"},
    "5-2": {
        "type": "iconography",
        "header": "1 文で、ページが増える",
        "items": [
            {"icon": "📝", "label": "ブログ"},
            {"icon": "💰", "label": "料金"},
            {"icon": "❓", "label": "FAQ"},
            {"icon": "📞", "label": "問合せ"},
        ],
    },
    "5-3": {
        "type": "terminal_cmd",
        "label": "ナビゲーションを整える",
        "command": "> ナビを「トップ・自己紹介・作ったもの・\n  お問い合わせ」の 4 つに整理して。\n  スマホはハンバーガーメニューで。",
        "footer": "プロっぽいヘッダーが完成",
    },

    # 第6章: 自分のサイトを作る
    "6-1": {"type": "chapter", "num": "6", "title": "自分のサイトを、作る"},
    "6-2": {
        "type": "checklist",
        "header": "自分の情報を流し込む",
        "items": [
            "名前・職業・趣味",
            "配色 (紺×ゴールド等)",
            "スマホ対応も忘れず",
        ],
        "footer": "テンプレートを自分仕様に",
    },
    "6-3": {
        "type": "checklist",
        "header": "完成チェック",
        "items": [
            "PC で全ページが表示",
            "スマホサイズも崩れない",
            "リンクが切れていない",
        ],
        "footer": "開発者ツールでスマホ表示確認",
    },

    # 第7章: コツ
    "7-1": {"type": "chapter", "num": "7", "title": "上達の 5 つのコツ"},
    "7-2": {
        "type": "tip",
        "num": "1",
        "tip": "内容 → 見た目",
        "bad": "見た目から決める",
        "good": "内容を固めてから装飾",
    },
    "7-3": {
        "type": "tip",
        "num": "2",
        "tip": "完璧主義を捨てる",
        "bad": "悩み続けて手が止まる",
        "good": "とりあえず形にして直す",
    },
    "7-4": {
        "type": "tip",
        "num": "3",
        "tip": "エラーは丸投げ",
        "bad": "自分で原因を考え込む",
        "good": "エラー文をそのまま AI へ",
    },
    "7-5": {
        "type": "tip",
        "num": "4",
        "tip": "スクショを渡す",
        "bad": "文字で説明する",
        "good": "画像でドラッグ&ドロップ",
    },
    "7-6": {
        "type": "tip",
        "num": "5",
        "tip": "人に見せる",
        "bad": "1 人で完璧主義",
        "good": "家族・友達に意見を聞く",
    },

    # 第8章: 一週間後の自分
    "8-1": {"type": "chapter", "num": "8", "title": "1 週間後の自分"},
    "8-2": {
        "type": "big_statement",
        "main": "「自分のサイトだ」",
        "sub": "1 週間前の自分には、想像できなかった景色。",
    },

    # 宿題 + エンディング
    "9-1": {
        "type": "checklist",
        "header": "今週の宿題",
        "items": [
            "自分のサイトを 3 ページ以上",
            "PC とスマホでスクショ",
            "コミュニティに投稿",
        ],
        "footer": "Week 3 で、デザインをプロ品質に",
    },
    "9-2": {
        "type": "closing",
        "main": "Week 3 で、",
        "main_accent": "また会おう",
        "sub": "次は、デザインを AI に注文する技術。",
    },
}
