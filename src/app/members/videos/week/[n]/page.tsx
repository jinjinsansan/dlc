import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import VideoCard from "@/components/members/VideoCard";

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

export function generateStaticParams() {
  return Array.from({ length: 8 }, (_, i) => ({ n: String(i + 1) }));
}

export default async function WeekVideoPage({
  params,
}: {
  params: { n: string };
}) {
  const week = parseInt(params.n, 10);
  if (isNaN(week) || week < 1 || week > 8) {
    notFound();
  }

  const meta = WEEK_TITLES[week];
  if (!meta) notFound();

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Week の動画を取得 (intro = sort_order 0, main = sort_order 1)
  const { data: videos } = await supabase
    .from("videos")
    .select(
      "id, week, title, description, storage_path, cloudflare_video_id, duration_seconds, unlocked_at, sort_order"
    )
    .eq("week", week)
    .order("sort_order", { ascending: true });

  const { data: watches } = await supabase
    .from("video_watches")
    .select("video_id")
    .eq("user_id", user?.id);

  const watchedIds = new Set((watches ?? []).map((w) => w.video_id));
  const now = new Date();

  // intro / main を分離
  const intro = (videos ?? []).find((v: Video) => v.sort_order === 0) ?? null;
  const main = (videos ?? []).find((v: Video) => v.sort_order === 1) ?? null;

  const isMainUnlocked =
    main?.unlocked_at && new Date(main.unlocked_at) <= now;

  const prevWeek = week > 1 ? week - 1 : null;
  const nextWeek = week < 8 ? week + 1 : null;

  return (
    <div>
      {/* Eyebrow + back */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Link
          href="/members/videos"
          className="font-mono-jp"
          style={{
            fontSize: 11,
            color: "var(--color-text-muted)",
            letterSpacing: "0.18em",
          }}
        >
          ← VIDEOS
        </Link>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "var(--color-border-hair)",
          }}
        />
        <span
          className="font-mono-jp"
          style={{
            fontSize: 11,
            color: "var(--color-text-dim)",
            letterSpacing: "0.2em",
          }}
        >
          WEEK {String(week).padStart(2, "0")} / 08
        </span>
      </div>

      {/* Title */}
      <div style={{ marginBottom: 48 }}>
        <div
          className="font-mono-jp"
          style={{
            fontSize: 11,
            color: "var(--color-primary)",
            letterSpacing: "0.3em",
            marginBottom: 16,
          }}
        >
          WEEK {String(week).padStart(2, "0")}
        </div>
        <h1
          className="font-serif-jp"
          style={{
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          {meta.title}
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--color-text-muted)",
            lineHeight: 1.8,
          }}
        >
          {meta.subtitle}
        </p>
      </div>

      {/* Main lesson video (大きく) */}
      <section style={{ marginBottom: 64 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <span
            className="font-serif-jp"
            style={{ fontSize: 14, color: "var(--color-primary)" }}
          >
            № 01
          </span>
          <span className="eyebrow">MAIN LESSON</span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "var(--color-border-hair)",
            }}
          />
        </div>
        {main ? (
          isMainUnlocked ? (
            <VideoCard
              video={main}
              watched={watchedIds.has(main.id)}
              userId={user?.id ?? ""}
            />
          ) : (
            <div
              style={{
                padding: 48,
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-hair)",
                textAlign: "center",
                color: "var(--color-text-muted)",
              }}
            >
              <div
                className="font-mono-jp"
                style={{
                  fontSize: 11,
                  color: "var(--color-text-dim)",
                  letterSpacing: "0.2em",
                  marginBottom: 12,
                }}
              >
                LOCKED
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8 }}>
                Week {week} の本編動画は、まだ公開されていません。
                <br />
                管理者によるアンロック後に視聴可能になります。
              </p>
            </div>
          )
        ) : (
          <div
            style={{
              padding: 48,
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-hair)",
              textAlign: "center",
              color: "var(--color-text-muted)",
              fontSize: 14,
            }}
          >
            動画を準備中です
          </div>
        )}
      </section>

      {/* Intro video (補助) */}
      {intro && (
        <section style={{ marginBottom: 64 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <span
              className="font-serif-jp"
              style={{ fontSize: 14, color: "var(--color-primary)" }}
            >
              № 02
            </span>
            <span className="eyebrow">PREVIEW (30 SEC)</span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "var(--color-border-hair)",
              }}
            />
          </div>
          <div style={{ maxWidth: 600 }}>
            <VideoCard
              video={intro}
              watched={watchedIds.has(intro.id)}
              userId={user?.id ?? ""}
            />
          </div>
        </section>
      )}

      {/* Materials link */}
      <section style={{ marginBottom: 64 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <span
            className="font-serif-jp"
            style={{ fontSize: 14, color: "var(--color-primary)" }}
          >
            № 03
          </span>
          <span className="eyebrow">MATERIALS</span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "var(--color-border-hair)",
            }}
          />
        </div>
        <Link
          href="/members/materials"
          style={{
            display: "block",
            padding: 32,
            background: "var(--color-bg-deep)",
            border: "1px solid var(--color-border-hair)",
            textDecoration: "none",
            transition: "border-color .2s",
          }}
        >
          <div
            className="font-mono-jp"
            style={{
              fontSize: 10,
              color: "var(--color-primary)",
              letterSpacing: "0.2em",
              marginBottom: 8,
            }}
          >
            WEEK {String(week).padStart(2, "0")} 教材
          </div>
          <div
            className="font-serif-jp"
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--color-text)",
            }}
          >
            PDF 教材 + フレーズ集を見る →
          </div>
        </Link>
      </section>

      {/* Prev / Next */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 32,
          borderTop: "1px solid var(--color-border-hair)",
        }}
      >
        {prevWeek ? (
          <Link
            href={`/members/videos/week/${prevWeek}`}
            className="font-mono-jp"
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              letterSpacing: "0.18em",
            }}
          >
            ← WEEK {String(prevWeek).padStart(2, "0")}
          </Link>
        ) : (
          <span />
        )}
        {nextWeek ? (
          <Link
            href={`/members/videos/week/${nextWeek}`}
            className="font-mono-jp"
            style={{
              fontSize: 12,
              color: "var(--color-primary)",
              letterSpacing: "0.18em",
            }}
          >
            WEEK {String(nextWeek).padStart(2, "0")} →
          </Link>
        ) : (
          <Link
            href="/members/dashboard"
            className="font-mono-jp"
            style={{
              fontSize: 12,
              color: "var(--color-primary)",
              letterSpacing: "0.18em",
            }}
          >
            DASHBOARD →
          </Link>
        )}
      </div>
    </div>
  );
}
