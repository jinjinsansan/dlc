"""Week 5 本編 visual"""

SCENE_VISUAL: dict[str, dict] = {
    "O1": {"type": "welcome", "title": "ようこそ。", "subtitle": "Week 5 — AI の力をアプリに入れる"},
    "O2": {"type": "promise", "pretext": "今週、あなたのアプリは。", "main": "差別化された", "main_accent": "武器", "post": "を手に入れる。"},

    "1-1": {"type": "chapter", "num": "1", "title": "アプリに入れられる、AI 機能"},
    "1-2": {"type": "iconography", "header": "AI 機能の全カタログ", "items": [
        {"icon": "💬", "label": "チャット"},
        {"icon": "📝", "label": "要約"},
        {"icon": "✍", "label": "文章生成"},
        {"icon": "🌐", "label": "翻訳"},
    ]},
    "1-3": {"type": "big_statement", "main": "差別化。", "sub": "1 つ加えるだけで、世界で戦える商品に。"},

    "2-1": {"type": "chapter", "num": "2", "title": "API キーの取得"},
    "2-2": {"type": "checklist", "header": "Anthropic API", "items": ["console.anthropic.com 登録", "Billing で $5 入金", "API Keys → Create Key"], "footer": "5 分で世界一賢い AI があなたのものに"},
    "2-3": {"type": "tip", "num": "🔒", "tip": "API キーの取扱い", "bad": "GitHub にコミット", "good": ".env.local に保存 → gitignore"},

    "3-1": {"type": "chapter", "num": "3", "title": "AI チャット機能を組み込む"},
    "3-2": {"type": "terminal_cmd", "label": "1 文で実装", "command": "> 画面右下に AI チャット機能を実装。\n  Anthropic Claude API を使って。\n  モデルは claude-haiku-4-5。",
            "footer": "対話アシスタントが生まれる"},
    "3-3": {"type": "terminal_cmd", "label": "ストリーミング対応", "command": "> 文字を 1 文字ずつ表示して、\n  本物の Claude Code みたいに\n  リアルタイムで返してきて。",
            "footer": "本格的な UX に近づく"},

    "4-1": {"type": "chapter", "num": "4", "title": "AI の、性格を作る"},
    "4-2": {"type": "terminal_cmd", "label": "システムプロンプト", "command": "> AI の性格を「親しみやすい執事」に。\n> AI の性格を「スポ根のコーチ」に。\n> AI の性格を「冷静な分析官」に。",
            "footer": "性格次第で UX が激変"},
    "4-3": {"type": "big_statement", "main": "最強の差別化。", "sub": "あなたのサービス独自のキャラクターを作る。"},

    "5-1": {"type": "chapter", "num": "5", "title": "テキスト系 AI 機能、応用"},
    "5-2": {"type": "iconography", "header": "1 行で実装できる機能", "items": [
        {"icon": "📋", "label": "要約"},
        {"icon": "💼", "label": "ビジネス文"},
        {"icon": "🌍", "label": "翻訳"},
        {"icon": "🏷", "label": "タグ生成"},
    ]},
    "5-3": {"type": "statement", "main": "手間が、", "main_accent": "ゼロ", "sub": "自動清書 → 自動タグ付け → 自動レコメンド。"},

    "6-1": {"type": "chapter", "num": "6", "title": "料金とコストの、現実"},
    "6-2": {"type": "stats", "big": "¥1", "label": "／ 1000 文字 (Haiku)", "footer": "100 回チャットで月 100 円。月額 1,000 円で十分黒字。"},
    "6-3": {"type": "checklist", "header": "コスト管理", "items": ["Console でリアルタイム可視化", "予算アラート設定", "Hard Limit で暴走防止"], "footer": "コスト爆発の心配なし"},

    "7-1": {"type": "chapter", "num": "7", "title": "今週、別物になる"},
    "7-2": {"type": "big_statement", "main": "「答えてくれた…！」", "sub": "世界の 9 割のサービスが、まだ持たない武器。"},

    "8-1": {"type": "checklist", "header": "今週の宿題", "items": ["AI 機能を 1 つ実装", "デモ動画 (30 秒)", "コミュニティに投稿"], "footer": "Week 6 で世界に公開"},
    "8-2": {"type": "closing", "main": "Week 6 で、", "main_accent": "世界に公開", "sub": "次は、あなたの URL が、世界に生まれる。"},
}
