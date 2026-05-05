"""Week 7 本編 visual"""

SCENE_VISUAL: dict[str, dict] = {
    "O1": {"type": "welcome", "title": "ようこそ。", "subtitle": "Week 7 — お金を受け取れるようにする"},
    "O2": {"type": "promise", "pretext": "趣味から、ビジネスへ。", "main": "一線を、", "main_accent": "越える", "post": "技術より、心理の壁を超える。"},

    "1-1": {"type": "chapter", "num": "1", "title": "お金の受け取り方、4 パターン"},
    "1-2": {"type": "iconography", "header": "課金モデル 4 種", "items": [
        {"icon": "💵", "label": "一括"},
        {"icon": "🔁", "label": "サブスク"},
        {"icon": "🎁", "label": "フリミアム"},
        {"icon": "💝", "label": "投げ銭"},
    ]},
    "1-3": {"type": "big_statement", "main": "Stripe。", "sub": "世界一のオンライン決済プロバイダーに任せる。"},

    "2-1": {"type": "chapter", "num": "2", "title": "Stripe アカウント開設"},
    "2-2": {"type": "checklist", "header": "本番アカウント", "items": ["stripe.com で登録", "住所・銀行口座・本人確認", "約 3 営業日で承認"], "footer": "テスト環境は即時利用可"},
    "2-3": {"type": "terminal_cmd", "label": "テスト決済の魔法カード", "command": "Card: 4242 4242 4242 4242\nExp:  04/30\nCVC:  100",
            "footer": "何度でも決済テスト可能"},

    "3-1": {"type": "chapter", "num": "3", "title": "一括払いの、実装"},
    "3-2": {"type": "terminal_cmd", "label": "1 文で実装", "command": "> Stripe で 9,800 円の一括払い決済を実装。\n  Checkout ページから決済画面へ。\n  決済後はサンキューページにリダイレクト。",
            "footer": "Checkout Session API 自動配線"},
    "3-3": {"type": "terminal_cmd", "label": "Webhook で記録", "command": "> Stripe Webhook を設定。\n  決済完了通知を受け取って、\n  Supabase の purchases テーブルに保存。",
            "footer": "サーバーレス関数で自動記録"},

    "4-1": {"type": "chapter", "num": "4", "title": "サブスクの、実装"},
    "4-2": {"type": "terminal_cmd", "label": "月額課金", "command": "> 月額 1,500 円のサブスクリプションを実装。\n  Stripe Subscription を使って。\n  解約は Customer Portal から。",
            "footer": "商品作成 → 定期請求まで自動"},
    "4-3": {"type": "tip", "num": "🤝", "tip": "信頼の鍵", "bad": "解約しにくくする", "good": "1 クリックで解約できる"},

    "5-1": {"type": "chapter", "num": "5", "title": "有料会員の、制御"},
    "5-2": {"type": "terminal_cmd", "label": "アクセス制御", "command": "> 契約中のユーザーだけが\n  /premium を見られるように。\n  プラン状態は users テーブルの\n  plan カラムで管理。",
            "footer": "ミドルウェアで自動チェック"},
    "5-3": {"type": "checklist", "header": "支払い滞納の自動処理", "items": ["Webhook で payment_failed 検知", "自動でフリープラン降格", "ユーザーへ通知メール"], "footer": "管理コスト ゼロ"},

    "6-1": {"type": "chapter", "num": "6", "title": "価格設定の、考え方"},
    "6-2": {"type": "stats", "big": "× 0.1", "label": "顧客が節約できる金額の 1/10", "footer": "顧客が月 ¥15,000 節約 → ¥1,500 が正解"},
    "6-3": {"type": "tip", "num": "💰", "tip": "迷ったら", "bad": "高すぎる価格", "good": "¥1,500 から始めて反応を見る"},

    "7-1": {"type": "chapter", "num": "7", "title": "今週、ビジネスの入口に立つ"},
    "7-2": {"type": "big_statement", "main": "「通った…！」", "sub": "副業の枠を超える、起業家の入口。"},

    "8-1": {"type": "checklist", "header": "今週の宿題", "items": ["決済機能を実装", "テスト環境で決済確認", "コミュニティにプラン公開"], "footer": "Week 8 で最初の 1 人を獲得"},
    "8-2": {"type": "closing", "main": "Week 8 で、", "main_accent": "最初の 1 人", "sub": "次は、本当に最初のお客さんと、出会う。"},
}
