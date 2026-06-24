"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

interface Video {
  id: string;
  title: string;
  description: string | null;
  storage_path: string | null;
  cloudflare_video_id: string | null;
  duration_seconds: number | null;
}

export default function VideoCard({
  video,
  watched: initialWatched,
  userId,
}: {
  video: Video;
  watched: boolean;
  userId: string;
}) {
  const [watched, setWatched] = useState(initialWatched);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchSignedUrl = async () => {
    if (signedUrl || loading) return;
    if (!video.storage_path) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/video-url?path=${encodeURIComponent(video.storage_path)}`
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "URL取得に失敗しました");
      }
      const { url } = await res.json();
      setSignedUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const markWatched = useCallback(async () => {
    if (watched) return;
    const supabase = createClient();
    const { error: err } = await supabase.from("video_watches").upsert(
      { user_id: userId, video_id: video.id },
      { onConflict: "user_id,video_id" }
    );
    if (!err) setWatched(true);
  }, [watched, userId, video.id]);

  // 50% 視聴したら自動で「視聴済み」マーク
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTimeUpdate = () => {
      if (
        !watched &&
        v.duration > 0 &&
        v.currentTime / v.duration > 0.5
      ) {
        markWatched();
      }
    };
    v.addEventListener("timeupdate", onTimeUpdate);
    return () => v.removeEventListener("timeupdate", onTimeUpdate);
  }, [watched, signedUrl, markWatched]);

  const formatDuration = (s: number | null): string => {
    if (!s) return "";
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  // 動画ソースの優先順: Cloudflare Stream > Supabase Storage > Placeholder
  const hasSource = !!(video.cloudflare_video_id || video.storage_path);

  return (
    <Card className="hover:border-primary/50 transition-colors relative">
      {watched && (
        <span className="absolute top-3 right-3 bg-primary text-bg text-xs font-bold px-2 py-1 rounded-full z-10">
          視聴済み
        </span>
      )}
      <div className="w-full aspect-video bg-bg rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
        {!hasSource ? (
          <span className="text-text-muted text-sm">動画準備中</span>
        ) : video.cloudflare_video_id ? (
          // Cloudflare Stream 経由 (iframe)
          <iframe
            src={`https://iframe.videodelivery.net/${video.cloudflare_video_id}?poster=https%3A%2F%2Fvideodelivery.net%2F${video.cloudflare_video_id}%2Fthumbnails%2Fthumbnail.jpg`}
            className="w-full h-full"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : signedUrl ? (
          // Supabase Storage 経由 (HTML5 video)
          <video
            ref={videoRef}
            src={signedUrl}
            controls
            controlsList="nodownload"
            className="w-full h-full object-contain bg-black"
            onError={() => setError("動画の読み込みに失敗しました")}
          />
        ) : (
          <button
            onClick={fetchSignedUrl}
            disabled={loading}
            className="flex flex-col items-center justify-center gap-3 w-full h-full bg-bg hover:bg-surface transition-colors disabled:opacity-50"
          >
            <span className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <span className="text-primary text-2xl ml-1">▶</span>
            </span>
            <span className="text-text-muted text-sm">
              {loading
                ? "読み込み中..."
                : error
                ? error
                : "クリックして再生"}
            </span>
            {video.duration_seconds && (
              <span className="text-text-muted text-xs">
                {formatDuration(video.duration_seconds)}
              </span>
            )}
          </button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-sm">{video.title}</h3>
          {video.description && (
            <p className="text-text-muted text-xs mt-1">{video.description}</p>
          )}
        </div>
        {!watched && hasSource && (
          <button
            onClick={markWatched}
            className="shrink-0 text-text-muted hover:text-primary text-xs border border-border hover:border-primary rounded px-2 py-1 transition-colors"
          >
            視聴済みにする
          </button>
        )}
      </div>
    </Card>
  );
}
