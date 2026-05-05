"""Week 3 本編 visual data"""

SCENE_VISUAL: dict[str, dict] = {
    "O1": {"type": "welcome", "title": "ようこそ。", "subtitle": "Week 3 — デザインを AI に注文する"},
    "O2": {"type": "promise", "pretext": "「センスがない」は、もう過去の話。", "main": "AI が、あなたを", "main_accent": "プロにする", "post": "頼むだけで、見た目が変わる。"},

    "1-1": {"type": "chapter", "num": "1", "title": "「プロっぽさ」の、正体"},
    "1-2": {"type": "iconography", "header": "プロっぽさ = 4 大要素で 80% 決まる", "items": [
        {"icon": "📏", "label": "余白"},
        {"icon": "🎨", "label": "配色"},
        {"icon": "🅰", "label": "フォント"},
        {"icon": "📸", "label": "写真"},
    ]},
    "1-3": {"type": "statement", "main": "全部、", "main_accent": "AI に頼める", "sub": "センスではなく、「正しい頼み方」を知っているかだけが差になる。"},

    "2-1": {"type": "chapter", "num": "2", "title": "色とフォントの、頼み方"},
    "2-2": {"type": "terminal_cmd", "label": "雰囲気で頼む", "command": "> 高級感のある黒×ゴールドにして\n> ナチュラルでオーガニックに\n> ポップで明るく\n> クールで知的に",
            "footer": "雰囲気のキーワードで配色が変わる"},
    "2-3": {"type": "terminal_cmd", "label": "厳密に色を指定", "command": "> メインカラーを #C9A84C に\n> アクセントを #EF4444 に\n> 背景を #0A0A0F に",
            "footer": "ピクセル単位で正確"},
    "2-4": {"type": "terminal_cmd", "label": "フォントを変える", "command": "> フォントを Noto Sans JP に\n> 見出しはセリフ体の高級感あるやつに\n> 本文は読みやすい丸ゴシックで",
            "footer": "和文・欧文どちらも自由"},

    "3-1": {"type": "chapter", "num": "3", "title": "レイアウトを、変える"},
    "3-2": {"type": "iconography", "header": "1 文で構造が変わる", "items": [
        {"icon": "🖥", "label": "全画面ヒーロー"},
        {"icon": "▦", "label": "2 カラム"},
        {"icon": "◳", "label": "3 列グリッド"},
        {"icon": "↕", "label": "ジグザグ"},
    ]},
    "3-3": {"type": "statement", "main": "余白を広げるだけで、", "main_accent": "プロっぽさが倍増", "sub": "「セクション間の余白をもっと広げて」だけで、別物に見える。"},

    "4-1": {"type": "chapter", "num": "4", "title": "デザイン上達の、最大の裏技"},
    "4-2": {"type": "terminal_cmd", "label": "URL を渡すだけ", "command": "> このサイトみたいに:\n  https://stripe.com",
            "footer": "雰囲気が丸ごと真似される"},
    "4-3": {"type": "iconography", "header": "世界一流の参考サイト", "items": [
        {"icon": "💳", "label": "Stripe"},
        {"icon": "📋", "label": "Notion"},
        {"icon": "📈", "label": "Linear"},
        {"icon": "🍎", "label": "Apple"},
    ]},

    "5-1": {"type": "chapter", "num": "5", "title": "スマホ対応を、忘れない"},
    "5-2": {"type": "terminal_cmd", "label": "1 文でレスポンシブ完了", "command": "> スマホでも綺麗に表示されるようにして\n  ヘッダーはハンバーガーメニュー化\n  カードは縦並び 1 列に",
            "footer": "文字サイズ・ボタン・メニュー全自動"},
    "5-3": {"type": "checklist", "header": "スマホで確認", "items": ["開発者ツール → スマホアイコン", "iPhone / Android で表示確認", "崩れたら「ここが崩れてる」と頼む"], "footer": "ブラウザだけで完結"},

    "6-1": {"type": "chapter", "num": "6", "title": "動きをつけて、命を吹き込む"},
    "6-2": {"type": "iconography", "header": "鉄板アニメーション", "items": [
        {"icon": "↘", "label": "フェードイン"},
        {"icon": "🪄", "label": "ホバー浮き"},
        {"icon": "🔍", "label": "画像ズーム"},
        {"icon": "✨", "label": "光るボタン"},
    ]},
    "6-3": {"type": "tip", "num": "⚠", "tip": "やりすぎ注意", "bad": "5 種類以上を盛る", "good": "3 種類以内に絞る"},

    "7-1": {"type": "chapter", "num": "7", "title": "仕上げのチェックリスト"},
    "7-2": {"type": "checklist", "header": "プロっぽさの最終確認", "items": ["余白は十分か (80px+)", "配色は 3 色以内か", "スマホで横スクロールしないか"], "footer": "全部 ✓ なら URL を送れる品質"},

    "8-1": {"type": "chapter", "num": "8", "title": "1 週間後の自分"},
    "8-2": {"type": "big_statement", "main": "「これ、自分が…？」", "sub": "Week 2 のサイトが、別人のように洗練される。"},

    "9-1": {"type": "checklist", "header": "今週の宿題", "items": ["ビフォー・アフター スクショ", "何を頼んで変わったか記述", "コミュニティに投稿"], "footer": "Week 4 で、動くアプリに化ける"},
    "9-2": {"type": "closing", "main": "Week 4 で、", "main_accent": "命を宿らせる", "sub": "次は、ただのページに、本物のアプリの動きを与える。"},
}
