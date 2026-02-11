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
    <div className="flex flex-col items-center gap-8 w-full px-6">
      <p
        className="text-xs uppercase tracking-[0.2em]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Round {round.number}
      </p>

      {/* Video or placeholder */}
      <div
        className="relative w-full max-w-sm aspect-video overflow-hidden"
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
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            {round.startActress.profilePath && (
              <img
                src={getProfileUrl(round.startActress.profilePath, "w185")}
                alt={round.clipActress}
                className="w-16 h-16 rounded-full object-cover"
                style={{ border: "1px solid var(--color-border)" }}
              />
            )}
            <div className="text-center">
              <div className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                {round.clipActress}
              </div>
              <div
                className="text-xs uppercase tracking-[0.1em] mt-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {round.clipMovie}
              </div>
            </div>
          </div>
        )}

        {/* Word overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <span
            className="text-2xl font-bold px-4 py-1"
            style={{
              color: "#fff",
              background: "rgba(0,0,0,0.7)",
            }}
          >
            {round.word}
          </span>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="px-8 py-2.5 text-sm uppercase tracking-[0.15em] font-medium transition-all active:scale-95"
        style={{
          background: "var(--color-accent)",
          color: "#fff",
        }}
      >
        Play
      </button>
    </div>
  );
}
