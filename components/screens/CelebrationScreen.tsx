"use client";

import { useState, useRef, useEffect } from "react";
import { ROUNDS } from "@/lib/game-data";
import { getProfileUrl } from "@/lib/game-data";

type Phase = "montage" | "reveal" | "response";

export function CelebrationScreen() {
  const [phase, setPhase] = useState<Phase>("montage");
  const [currentClip, setCurrentClip] = useState(0);
  const [noPressed, setNoPressed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideos, setHasVideos] = useState(true);

  // Auto-advance clips in montage
  useEffect(() => {
    if (phase !== "montage") return;

    // If no video files, skip montage after showing each word briefly
    if (!hasVideos) {
      const timer = setTimeout(() => {
        if (currentClip < ROUNDS.length - 1) {
          setCurrentClip((c) => c + 1);
        } else {
          setPhase("reveal");
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, currentClip, hasVideos]);

  const handleVideoEnd = () => {
    if (currentClip < ROUNDS.length - 1) {
      setCurrentClip((c) => c + 1);
    } else {
      setPhase("reveal");
    }
  };

  const handleYes = () => {
    setPhase("response");
  };

  const handleNo = () => {
    setNoPressed(true);
    // After a moment, only show yes
    setTimeout(() => setNoPressed(false), 2000);
  };

  if (phase === "montage") {
    const round = ROUNDS[currentClip];
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-6 px-6">
        <div
          className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden"
          style={{ background: "var(--color-surface)" }}
        >
          {hasVideos ? (
            <video
              ref={videoRef}
              key={currentClip}
              src={round.clipUrl}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              onEnded={handleVideoEnd}
              onError={() => setHasVideos(false)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <img
                src={getProfileUrl(round.startActress.profilePath, "w185")}
                alt={round.clipActress}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-sm" style={{ color: "var(--color-text)" }}>
                {round.clipActress}
              </div>
            </div>
          )}

          {/* Word overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-4xl font-bold"
              style={{
                color: "#fff",
                textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              }}
            >
              {round.word}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "reveal") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-8 px-6">
        {/* Actress portraits with words */}
        <div className="flex justify-center gap-4 flex-wrap">
          {ROUNDS.map((round) => (
            <div key={round.number} className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 rounded-full overflow-hidden"
                style={{ border: "2px solid var(--color-accent)" }}
              >
                <img
                  src={getProfileUrl(round.startActress.profilePath, "w185")}
                  alt={round.clipActress}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: "var(--color-accent)" }}
              >
                {round.word}
              </span>
            </div>
          ))}
        </div>

        {/* Full question */}
        <h1
          className="text-3xl font-bold text-center"
          style={{ color: "var(--color-text)" }}
        >
          Will you be my Valentine?
        </h1>

        {/* Yes / No */}
        <div className="flex gap-4">
          <button
            onClick={handleYes}
            className="px-8 py-3 rounded-full text-base font-semibold transition-transform active:scale-95"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            Yes
          </button>
          {!noPressed ? (
            <button
              onClick={handleNo}
              className="px-8 py-3 rounded-full text-base font-semibold transition-transform active:scale-95"
              style={{
                background: "transparent",
                color: "var(--color-text-muted)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              No
            </button>
          ) : (
            <span
              className="px-8 py-3 text-base font-semibold"
              style={{ color: "var(--color-error)" }}
            >
              Wrong answer!
            </span>
          )}
        </div>
      </div>
    );
  }

  // Response (after Yes)
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6 px-6">
      <div
        className="text-5xl font-bold text-center"
        style={{ color: "var(--color-accent)" }}
      >
        Happy Valentine&apos;s Day!
      </div>
      <div
        className="text-lg text-center"
        style={{ color: "var(--color-text-muted)" }}
      >
        I love you, PJ
      </div>
    </div>
  );
}
