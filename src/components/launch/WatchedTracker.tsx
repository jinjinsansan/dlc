"use client";

import { useEffect } from "react";

export default function WatchedTracker({ episodeNumber }: { episodeNumber: number }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dlogic-watched");
      const watched: number[] = stored ? JSON.parse(stored) : [];
      if (!watched.includes(episodeNumber)) {
        watched.push(episodeNumber);
        localStorage.setItem("dlogic-watched", JSON.stringify(watched));
      }
    } catch {}
  }, [episodeNumber]);

  return null;
}
