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
    setTimeout(() => setNoPressed(false), 2000);
  };

  if (phase === "montage") {
    const round = ROUNDS[currentClip];
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-6 px-6">
        <div
          className="relative w-full max-w-sm aspect-video overflow-hidden"
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
                style={{ border: "1px solid var(--color-border)" }}
              />
              <p
                className="text-xs uppercase tracking-[0.15em]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {round.clipActress}
              </p>
            </div>
          )}

          {/* Word overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-serif text-4xl font-bold italic"
              style={{
                color: "#fff",
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              }}
            >
              {round.word}
            </span>
          </div>
        </div>

        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {currentClip + 1} / {ROUNDS.length}
        </p>
      </div>
    );
  }

  if (phase === "reveal") {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center gap-10 px-6 transition-colors duration-1000"
        style={{
          background: "var(--color-reveal-bg)",
          color: "var(--color-reveal-text)",
        }}
      >
        {/* Actress portraits with words */}
        <div className="flex justify-center gap-5 flex-wrap">
          {ROUNDS.map((round) => (
            <div key={round.number} className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-full overflow-hidden"
                style={{ border: "1.5px solid var(--color-accent)" }}
              >
                <img
                  src={getProfileUrl(round.startActress.profilePath, "w185")}
                  alt={round.clipActress}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="font-serif text-sm italic"
                style={{ color: "var(--color-accent)" }}
              >
                {round.word}
              </span>
            </div>
          ))}
        </div>

        {/* Full question — serif reveal */}
        <h1 className="font-serif text-4xl font-bold italic text-center leading-tight">
          Will you be my Valentine?
        </h1>

        {/* Yes / No */}
        <div className="flex gap-6 items-center">
          <button
            onClick={handleYes}
            className="px-10 py-3 text-sm uppercase tracking-[0.2em] font-medium transition-all active:scale-95"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            Yes
          </button>
          {!noPressed ? (
            <button
              onClick={handleNo}
              className="px-10 py-3 text-sm uppercase tracking-[0.2em] font-medium transition-all active:scale-95"
              style={{
                background: "transparent",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
              }}
            >
              No
            </button>
          ) : (
            <span
              className="text-sm uppercase tracking-[0.15em]"
              style={{ color: "var(--color-error)" }}
            >
              Wrong answer
            </span>
          )}
        </div>
      </div>
    );
  }

  // Response (after Yes)
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6"
      style={{
        background: "var(--color-reveal-bg)",
        color: "var(--color-reveal-text)",
      }}
    >
      <h1 className="font-serif text-5xl font-bold italic text-center leading-tight">
        Happy Valentine&apos;s Day
      </h1>
      <p
        className="text-xs uppercase tracking-[0.2em]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        I love you, PJ
      </p>
    </div>
  );
}
