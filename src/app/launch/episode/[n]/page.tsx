import { notFound } from "next/navigation";
import Link from "next/link";
import EmailForm from "@/components/launch/EmailForm";
import WatchedTracker from "@/components/launch/WatchedTracker";
import { episodes } from "@/lib/episodes";
import { enrollmentOpen } from "@/lib/siteConfig";

const EPISODE_DURATIONS = ["14:32", "18:45", "16:20", "22:10"];

function PublicHeader() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border-hair)",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" className="font-serif-jp" style={{ fontSize: 22, fontWeight: 700 }}>
          D-<span style={{ color: "var(--color-primary)" }}>lab</span>
        </Link>
        <Link
          href="/launch"
          className="font-mono-jp"
          style={{
            fontSize: 11,
            color: "var(--color-text-muted)",
            letterSpacing: "0.18em",
          }}
        >
          ← BACK TO LAUNCH
        </Link>
      </div>
    </header>
  );
}

export function generateStaticParams() {
  return episodes.map((ep) => ({ n: String(ep.number) }));
}

export default function EpisodePage({ params }: { params: { n: string } }) {
  const episodeNum = parseInt(params.n, 10);
  const episode = episodes.find((ep) => ep.number === episodeNum);

  if (!episode) {
    notFound();
  }

  const dur = EPISODE_DURATIONS[episodeNum - 1] ?? "—";
  const prevEp = episodeNum > 1 ? episodeNum - 1 : null;
  const nextEp = episodeNum < 4 ? episodeNum + 1 : null;

  return (
    <>
      <PublicHeader />
      <WatchedTracker episodeNumber={episodeNum} />
      <main style={{ padding: "120px 48px 80px" }}>
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 48,
          }}
        >
          {/* Main column */}
          <div>
            {/* Eyebrow */}
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
                style={{
                  fontSize: 14,
                  color: "var(--color-primary)",
                  fontFeatureSettings: '"tnum"',
                }}
              >
                № 0{episodeNum} / 04
              </span>
              <span className="eyebrow">{episode.purpose}</span>
              <div style={{ flex: 1, height: 1, background: "var(--color-border-hair)" }} />
              <span
                className="font-mono-jp"
                style={{ fontSize: 11, color: "var(--color-text-dim)" }}
              >
                {dur}
              </span>
            </div>

            <h1
              className="font-serif-jp"
              style={{
                fontSize: "clamp(36px, 4vw, 56px)",
                lineHeight: 1.15,
                fontWeight: 700,
                marginBottom: 32,
                letterSpacing: "-0.01em",
              }}
            >
              {episode.title}
            </h1>

            {/* Player placeholder */}
            <div
              style={{
                position: "relative",
                aspectRatio: "16/9",
                background: "var(--color-bg-deep)",
                border: "1px solid var(--color-border)",
                overflow: "hidden",
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.15), transparent 60%), linear-gradient(135deg, #0a0a0f, #181828)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="font-mono-jp"
                  style={{
                    position: "absolute",
                    top: 24,
                    left: 24,
                    fontSize: 11,
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.2em",
                  }}
                >
                  EPISODE 0{episodeNum}
                </div>
                <div
                  className="font-mono-jp"
                  style={{
                    position: "absolute",
                    top: 24,
                    right: 24,
                    fontSize: 11,
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.2em",
                  }}
                >
                  {dur}
                </div>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    border: "1px solid var(--color-primary)",
                    background: "rgba(201,168,76,0.1)",
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                  }}
                >
                  ▶
                </div>
                <div
                  className="font-mono-jp"
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: 24,
                    fontSize: 10,
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.18em",
                  }}
                >
                  Cloudflare Stream 埋め込み予定
                </div>
              </div>
            </div>

            {/* Episode body */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                gap: 48,
                marginBottom: 64,
              }}
            >
              <div
                className="font-mono-jp"
                style={{
                  fontSize: 11,
                  color: "var(--color-text-dim)",
                  letterSpacing: "0.2em",
                }}
              >
                SUMMARY
              </div>
              <div>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--color-text-muted)",
                    lineHeight: 1.9,
                  }}
                >
                  {episode.fullDescription}
                </p>
              </div>
            </div>

            {/* Episode 4 Apply CTA */}
            {episodeNum === 4 && (
              <div
                style={{
                  padding: 40,
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-primary)",
                  marginBottom: 32,
                  textAlign: "center",
                }}
              >
                <div className="eyebrow" style={{ marginBottom: 12 }}>
                  — READY?
                </div>
                <h2
                  className="font-serif-jp"
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  D-lab で、作れる側の人間に。
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-muted)",
                    marginBottom: 24,
                    lineHeight: 1.7,
                  }}
                >
                  {enrollmentOpen
                    ? "第 1 期生 限定枠で募集中。"
                    : "第 1 期生はまもなく募集開始。公開通知は下記から。"}
                </p>
                <Link
                  href="/apply"
                  className="btn btn-primary"
                  style={{ padding: "16px 32px", fontSize: 14 }}
                >
                  {enrollmentOpen ? "今すぐ申し込む" : "近日公開・事前登録"}{" "}
                  <span className="arrow">→</span>
                </Link>
              </div>
            )}

            {/* Email opt-in */}
            <div
              style={{
                padding: 40,
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-hair)",
                borderLeft: "2px solid var(--color-primary)",
                marginBottom: 32,
              }}
            >
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                — STAY UPDATED
              </div>
              <h3
                className="font-serif-jp"
                style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}
              >
                次回公開を、メールで受け取る。
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                  marginBottom: 24,
                  lineHeight: 1.8,
                }}
              >
                公開と同時に通知。配信は週 1 回まで、いつでも解除可能です。
              </p>
              <EmailForm />
            </div>

            {/* Prev / Next */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 64,
                paddingTop: 32,
                borderTop: "1px solid var(--color-border-hair)",
              }}
            >
              {prevEp ? (
                <Link
                  href={`/launch/episode/${prevEp}`}
                  className="font-mono-jp"
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    letterSpacing: "0.18em",
                  }}
                >
                  ← EP {String(prevEp).padStart(2, "0")}
                </Link>
              ) : (
                <span
                  className="font-mono-jp"
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.15em",
                  }}
                >
                  FIRST EPISODE
                </span>
              )}
              {nextEp ? (
                <Link
                  href={`/launch/episode/${nextEp}`}
                  className="font-mono-jp"
                  style={{
                    fontSize: 12,
                    color: "var(--color-primary)",
                    letterSpacing: "0.18em",
                  }}
                >
                  NEXT — EP {String(nextEp).padStart(2, "0")} →
                </Link>
              ) : (
                <Link href="/apply" className="btn btn-primary">
                  {enrollmentOpen ? "第1期に申し込む" : "近日公開・事前登録"}{" "}
                  <span className="arrow">→</span>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar — episode list */}
          <aside>
            <div
              className="font-mono-jp"
              style={{
                fontSize: 11,
                color: "var(--color-text-dim)",
                letterSpacing: "0.2em",
                marginBottom: 24,
              }}
            >
              SERIES / 4 EPISODES
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                background: "var(--color-border-hair)",
                border: "1px solid var(--color-border-hair)",
              }}
            >
              {episodes.map((ep) => {
                const isCurrent = ep.number === episodeNum;
                const epDur = EPISODE_DURATIONS[ep.number - 1] ?? "—";
                return (
                  <Link
                    key={ep.number}
                    href={`/launch/episode/${ep.number}`}
                    style={{
                      background: isCurrent
                        ? "linear-gradient(90deg, rgba(201,168,76,0.08), transparent)"
                        : "var(--color-bg)",
                      padding: 24,
                      borderLeft: isCurrent
                        ? "2px solid var(--color-primary)"
                        : "2px solid transparent",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        className="font-serif-jp"
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: isCurrent
                            ? "var(--color-primary)"
                            : "var(--color-text-dim)",
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        0{ep.number}
                      </span>
                      <span
                        className="font-mono-jp"
                        style={{
                          fontSize: 10,
                          color: "var(--color-text-dim)",
                          letterSpacing: "0.15em",
                        }}
                      >
                        {epDur}
                      </span>
                    </div>
                    <h4
                      className="font-serif-jp"
                      style={{
                        fontSize: 15,
                        fontWeight: isCurrent ? 700 : 500,
                        lineHeight: 1.5,
                        color: "var(--color-text)",
                      }}
                    >
                      {ep.title}
                    </h4>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/apply"
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: 32,
              }}
            >
              {enrollmentOpen ? "申し込み" : "近日公開・事前登録"}{" "}
              <span className="arrow">→</span>
            </Link>
          </aside>
        </div>
      </main>
    </>
  );
}
