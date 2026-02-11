"use client";

import { useState, useRef } from "react";
import { RoundConfig } from "@/lib/types";
import { getProfileUrl } from "@/lib/game-data";

interface VideoClipProps {
  round: RoundConfig;
  onContinue: () => void;
}

export function VideoClip({ round, onContinue }: VideoClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(true);

  return (
    <div className="flex flex-col items-center gap-6 w-full px-6">
      <div className="text-center">
        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
          Round {round.number}
        </span>
      </div>

      {/* Video or placeholder */}
      <div
        className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden"
        style={{ background: "var(--color-surface)" }}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            src={round.clipUrl}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onError={() => setHasVideo(false)}
          />
        ) : (
          // Placeholder when no video file exists
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            {round.startActress.profilePath && (
              <img
                src={getProfileUrl(round.startActress.profilePath, "w185")}
                alt={round.clipActress}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
              {round.clipActress}
            </div>
            <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {round.clipMovie}
            </div>
          </div>
        )}

        {/* Word overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <span
            className="text-3xl font-bold px-4 py-1 rounded-lg"
            style={{
              color: "#fff",
              background: "rgba(0,0,0,0.6)",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {round.word}
          </span>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="px-6 py-2.5 rounded-full text-sm font-semibold transition-transform active:scale-95"
        style={{
          background: "var(--color-accent)",
          color: "#fff",
        }}
      >
        Play Round {round.number}
      </button>
    </div>
  );
}
