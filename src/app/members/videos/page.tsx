import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PageHead from "@/components/members/PageHead";

interface Video {
  id: string;
  week: number;
  title: string;
  description: string | null;
  storage_path: string | null;
  cloudflare_video_id: string | null;
  duration_seconds: number | null;
  unlocked_at: string | null;
  sort_order: number | null;
}

const WEEK_TITLES: Record<number, { title: string; subtitle: string }> = {
  1: { title: "はじめての Claude Code", subtitle: "インストール → 対話 → メモ帳完成" },
  2: { title: "日本語だけで Web ページを作る", subtitle: "自分の Web サイトを 1 週間で公開" },
  3: { title: "デザインを AI に注文する", subtitle: "プロ品質の見た目を 5 分で" },
  4: { title: "機能を言葉で追加する", subtitle: "Web サイトを Web アプリに進化" },
  5: { title: "AI の力をアプリに入れる", subtitle: "差別化の最大の武器" },
  6: { title: "完成させて世界に公開する", subtitle: "あなたの URL が世界に生まれる" },
  7: { title: "お金を受け取れるようにする", subtitle: "趣味からビジネスへ。一線を越える" },
  8: { title: "お客さんを集めて稼ぐ", subtitle: "最初の 1 人と本当に出会う" },
};

export default async function VideosPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: videos } = await supabase
    .from("videos")
    .select(
      "id, week, title, description, storage_path, cloudflare_video_id, duration_seconds, unlocked_at, sort_order"
    )
    .order("week", { ascending: true })
    .order("sort_order", { ascending: true });

  const { data: watches } = await supabase
    .from("video_watches")
    .select("video_id")
    .eq("user_id", user?.id);

  const watchedIds = new Set((watches ?? []).map((w) => w.video_id));
  const now = new Date();

  const weeks = Array.from({ length: 8 }, (_, i) => i + 1);
  const videosByWeek = weeks.map((w) => ({
    week: w,
    main: (videos ?? []).find(
      (v: Video) => v.week === w && v.sort_order === 1
    ),
    intro: (videos ?? []).find(
      (v: Video) => v.week === w && v.sort_order === 0
    ),
  }));

  return (
    <div>
      <PageHead
        num="02"
        kicker="VIDEOS"
        title="動画ライブラリ"
        intro="Week 別の本編動画とイントロ。各 Week のページで、本編+教材を閲覧できます。"
      />

      {/* Week grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
          background: "var(--color-border-hair)",
          border: "1px solid var(--color-border-hair)",
        }}
      >
        {videosByWeek.map(({ week, main, intro }) => {
          const meta = WEEK_TITLES[week];
          const isMainUnlocked =
            main?.unlocked_at && new Date(main.unlocked_at) <= now;
          const watchedMain = main ? watchedIds.has(main.id) : false;

          return (
            <Link
              key={week}
              href={`/members/videos/week/${week}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                background: "var(--color-bg)",
                padding: 32,
                textDecoration: "none",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  className="font-serif-jp"
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "var(--color-primary)",
                    fontFeatureSettings: '"tnum"',
                    lineHeight: 1,
                  }}
                >
                  {String(week).padStart(2, "0")}
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  {watchedMain && (
                    <span
                      className="font-mono-jp"
                      style={{
                        fontSize: 9,
                        color: "var(--color-primary)",
                        letterSpacing: "0.2em",
                        padding: "3px 8px",
                        background: "rgba(201,168,76,0.1)",
                        border: "1px solid rgba(201,168,76,0.4)",
                      }}
                    >
                      ✓ WATCHED
                    </span>
                  )}
                  {!isMainUnlocked && main && (
                    <span
                      className="font-mono-jp"
                      style={{
                        fontSize: 9,
                        color: "var(--color-text-dim)",
                        letterSpacing: "0.2em",
                        padding: "3px 8px",
                        border: "1px solid var(--color-border-hair)",
                      }}
                    >
                      🔒 LOCKED
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3
                  className="font-serif-jp"
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--color-text)",
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {meta.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-muted)",
                    lineHeight: 1.7,
                  }}
                >
                  {meta.subtitle}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: "auto",
                  paddingTop: 16,
                  borderTop: "1px solid var(--color-border-hair)",
                }}
              >
                <span
                  className="font-mono-jp"
                  style={{
                    fontSize: 10,
                    color: main
                      ? "var(--color-primary)"
                      : "var(--color-text-dim)",
                    letterSpacing: "0.18em",
                  }}
                >
                  {main ? "● MAIN" : "○ MAIN"}
                </span>
                <span
                  className="font-mono-jp"
                  style={{
                    fontSize: 10,
                    color: intro
                      ? "var(--color-primary)"
                      : "var(--color-text-dim)",
                    letterSpacing: "0.18em",
                  }}
                >
                  {intro ? "● INTRO" : "○ INTRO"}
                </span>
                <span
                  className="font-mono-jp"
                  style={{
                    fontSize: 10,
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.18em",
                    marginLeft: "auto",
                  }}
                >
                  OPEN →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
