"""Week 4 本編 visual"""

SCENE_VISUAL: dict[str, dict] = {
    "O1": {"type": "welcome", "title": "ようこそ。", "subtitle": "Week 4 — 機能を言葉で追加する"},
    "O2": {"type": "promise", "pretext": "今週、あなたのサイトは。", "main": "本物の", "main_accent": "アプリ", "post": "に化ける。"},

    "1-1": {"type": "chapter", "num": "1", "title": "Web サイト vs Web アプリ"},
    "1-2": {"type": "comparison",
            "left_label": "Web サイト",
            "left_text": "・見るだけ\n・データは消える\n・誰が来ても同じ",
            "left_role": "個人の趣味の領域",
            "right_label": "Web アプリ",
            "right_text": "・操作できる\n・データが残る\n・ユーザー別の体験",
            "right_role": "本物のサービス",
            "highlight": "right"},
    "1-3": {"type": "big_statement", "main": "境界線。", "sub": "今週、その境界を超える。"},

    "2-1": {"type": "chapter", "num": "2", "title": "データ保存の救世主、Supabase"},
    "2-2": {"type": "iconography", "header": "Supabase に全部入っている", "items": [
        {"icon": "🗄", "label": "DB"},
        {"icon": "🔐", "label": "認証"},
        {"icon": "📁", "label": "ストレージ"},
        {"icon": "⚡", "label": "リアルタイム"},
    ]},
    "2-3": {"type": "checklist", "header": "Supabase 導入手順", "items": ["supabase.com で登録 (Gmail で 1 分)", "新規プロジェクト作成", "URL と KEY を .env.local に貼る"], "footer": "ここまで 5 分"},
    "2-4": {"type": "terminal_cmd", "label": "Claude Code に丸投げ", "command": "> Supabase をこのプロジェクトに\n  導入して。クライアントの設定と\n  .env.local の使い方も整えて。",
            "footer": "配線まで全部やってくれる"},

    "3-1": {"type": "chapter", "num": "3", "title": "ログイン機能を、言葉で実装"},
    "3-2": {"type": "terminal_cmd", "label": "認証ページを作る", "command": "> 会員登録ページとログインページを作って。\n  Supabase Auth でメール+パスワード認証。",
            "footer": "両方のページ + 認証ロジックを自動実装"},
    "3-3": {"type": "terminal_cmd", "label": "アクセス制御", "command": "> ログインした人だけが\n  /mypage を見られるように。",
            "footer": "ミドルウェアまで自動配線"},

    "4-1": {"type": "chapter", "num": "4", "title": "お問い合わせを、本物にする"},
    "4-2": {"type": "terminal_cmd", "label": "お問い合わせを DB へ", "command": "> お問い合わせフォームの送信を\n  Supabase の contacts テーブルに保存して。",
            "footer": "テーブル設計+API+UI 全自動"},
    "4-3": {"type": "terminal_cmd", "label": "管理画面を追加", "command": "> /admin/contacts に\n  お問い合わせ一覧を表示。\n  未対応/対応済のステータス管理付き。",
            "footer": "管理画面が一瞬で完成"},

    "5-1": {"type": "chapter", "num": "5", "title": "マイページの威力"},
    "5-2": {"type": "iconography", "header": "ログインユーザー専用", "items": [
        {"icon": "👤", "label": "プロフィール"},
        {"icon": "🛒", "label": "購入履歴"},
        {"icon": "❤", "label": "お気に入り"},
        {"icon": "🔔", "label": "通知"},
    ]},
    "5-3": {"type": "terminal_cmd", "label": "プロフィール写真", "command": "> ユーザーがプロフィール写真を\n  アップロードできるように。\n  Supabase Storage に保存。",
            "footer": "ファイルアップロードも自動"},

    "6-1": {"type": "chapter", "num": "6", "title": "エラー対処の、新常識"},
    "6-2": {"type": "tip", "num": "🛠", "tip": "エラー対処の鉄則", "bad": "自分で原因を考える", "good": "エラー文を Claude に貼る"},
    "6-3": {"type": "big_statement", "main": "9 割が、解決。", "sub": "スクリーンショット付きなら、ほぼ 100%。"},

    "7-1": {"type": "chapter", "num": "7", "title": "今週、決定的に変わるもの"},
    "7-2": {"type": "big_statement", "main": "「動いた…！」", "sub": "データが本当に保存される。これは別次元の体験。"},

    "8-1": {"type": "checklist", "header": "今週の宿題", "items": ["ログイン → マイページ → データ保存", "デモ動画 (画面録画 30 秒)", "コミュニティに投稿"], "footer": "Week 5 で AI を住まわせる"},
    "8-2": {"type": "closing", "main": "Week 5 で、", "main_accent": "AI を住まわせる", "sub": "次は、あなたのアプリに、AI 自身が宿る。"},
}
