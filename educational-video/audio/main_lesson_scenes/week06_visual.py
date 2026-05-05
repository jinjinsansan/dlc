"""Week 6 本編 visual"""

SCENE_VISUAL: dict[str, dict] = {
    "O1": {"type": "welcome", "title": "ようこそ。", "subtitle": "Week 6 — 完成させて世界に公開する"},
    "O2": {"type": "promise", "pretext": "今週、あなたの URL が。", "main": "世界に", "main_accent": "生まれる", "post": "PC から、飛び立つ瞬間。"},

    "1-1": {"type": "chapter", "num": "1", "title": "「公開」とは、何か"},
    "1-2": {"type": "comparison",
            "left_label": "今",
            "left_text": "・自分の PC だけで動く\n・他人は見られない\n・URL がない",
            "left_role": "ローカル開発",
            "right_label": "公開後",
            "right_text": "・世界中からアクセス\n・誰でも見られる\n・自分の URL を持つ",
            "right_role": "本物のサービス",
            "highlight": "right"},
    "1-3": {"type": "big_statement", "main": "無料。", "sub": "個人開発なら、すべて無料で公開できる。"},

    "2-1": {"type": "chapter", "num": "2", "title": "GitHub で、コードを保管"},
    "2-2": {"type": "iconography", "header": "GitHub = 世界一のコード保管庫", "items": [
        {"icon": "📦", "label": "保管"},
        {"icon": "🔄", "label": "履歴"},
        {"icon": "🌍", "label": "公開"},
        {"icon": "🆓", "label": "無料"},
    ]},
    "2-3": {"type": "terminal_cmd", "label": "Claude Code に丸投げ", "command": "> このプロジェクトを GitHub にアップして。\n  リポジトリ名は my-app。\n  README も整えて。",
            "footer": "リポジトリ作成 → アップロード自動"},

    "3-1": {"type": "chapter", "num": "3", "title": "Vercel で、デプロイする"},
    "3-2": {"type": "iconography", "header": "Vercel = Next.js 公式デプロイ先", "items": [
        {"icon": "⚡", "label": "高速"},
        {"icon": "🔗", "label": "GitHub 連携"},
        {"icon": "🌐", "label": "CDN"},
        {"icon": "🆓", "label": "個人無料"},
    ]},
    "3-3": {"type": "checklist", "header": "デプロイ 3 ステップ", "items": ["GitHub リポジトリを連携", "環境変数を設定", "Deploy ボタンを押す"], "footer": "URL がその場で生まれる"},

    "4-1": {"type": "chapter", "num": "4", "title": "独自ドメインを、つける"},
    "4-2": {"type": "comparison",
            "left_label": "デフォルト",
            "left_text": "your-app.vercel.app",
            "left_role": "練習用としては OK",
            "right_label": "独自ドメイン",
            "right_text": "your-brand.com",
            "right_role": "本物のブランド",
            "highlight": "right"},
    "4-3": {"type": "big_statement", "main": "ブランド。", "sub": "年 1,000 円で、自分の URL を手に入れる。"},

    "5-1": {"type": "chapter", "num": "5", "title": "SEO と、OGP"},
    "5-2": {"type": "terminal_cmd", "label": "SEO 設定", "command": "> 全ページのタイトルと\n  メタディスクリプションを設定。\n  各ページ固有のものに。",
            "footer": "Google 検索で見つかる"},
    "5-3": {"type": "terminal_cmd", "label": "OGP 画像を設定", "command": "> OGP 画像を作って設定。\n  サイト名、キャッチコピー、ロゴ\n  入りの黒×ゴールドで。",
            "footer": "X / LINE シェア時の見え方が激変"},

    "6-1": {"type": "chapter", "num": "6", "title": "家族や友達に、見せる"},
    "6-2": {"type": "checklist", "header": "リリース直後にやること", "items": ["家族 or 親友 3 人に URL 送付", "「これ、自分が作った」と伝える", "感想を聞く"], "footer": "人生最大の感動の 1 つ"},
    "6-3": {"type": "tip", "num": "💡", "tip": "フィードバックの聞き方", "bad": "「どう?」", "good": "「分かりにくい所、3 つ教えて」"},

    "7-1": {"type": "chapter", "num": "7", "title": "今週、決定的に変わる"},
    "7-2": {"type": "big_statement", "main": "「これ、すごい…！」", "sub": "自分のサービスが世界中からアクセスできる。永遠に変わる自信。"},

    "8-1": {"type": "checklist", "header": "今週の宿題", "items": ["本番公開する", "コミュニティに URL 投稿", "仲間の感想を受け取る"], "footer": "Week 7 で、お金を受け取る"},
    "8-2": {"type": "closing", "main": "Week 7 で、", "main_accent": "お金を受け取る", "sub": "次は、趣味からビジネスへ。一線を越える。"},
}
