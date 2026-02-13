"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ROUNDS } from "@/lib/game-data";
import { getProfileUrl } from "@/lib/game-data";

type Phase = "montage" | "reveal" | "response";

const MONTAGE_CLIPS = [
  { src: "/clips/toni-colette-hereditary-vid.mp4", screamAt: 5, duration: 2.5 },
  { src: "/clips/florence-pugh-midsommar-vid.mp4", screamAt: 6, duration: 2.5 },
  { src: "/clips/jenna-ortega-x-vid.mp4", screamAt: 4, duration: 2.5 },
  { src: "/clips/naomi-scott-smile-2-vid.mp4", screamAt: 9, duration: 2.5 },
  { src: "/clips/samara-weaving-ready-or-not-vid.mp4", screamAt: 4, duration: 2.5 },
];

export function CelebrationScreen() {
  const [phase, setPhase] = useState<Phase>("montage");
  const [currentClip, setCurrentClip] = useState(0);
  const [noPressed, setNoPressed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideos, setHasVideos] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advanceClip = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (currentClip < ROUNDS.length - 1) {
      setCurrentClip((c) => c + 1);
    } else {
      setPhase("reveal");
    }
  }, [currentClip]);

  // Seek to scream timestamp (backed up if needed), auto-advance after duration
  useEffect(() => {
    if (phase !== "montage") return;

    const video = videoRef.current;
    const clip = MONTAGE_CLIPS[currentClip];

    if (video && hasVideos && clip) {
      const handleMetadata = () => {
        // Back up start time so full duration plays without hitting end
        const maxStart = Math.max(0, video.duration - clip.duration);
        video.currentTime = Math.min(clip.screamAt, maxStart);
        video.play().catch(() => {});

        timerRef.current = setTimeout(advanceClip, clip.duration * 1000);
      };

      // If metadata already loaded (cached), fire immediately
      if (video.readyState >= 1) {
        handleMetadata();
      } else {
        video.addEventListener("loadedmetadata", handleMetadata, { once: true });
      }

      return () => {
        video.removeEventListener("loadedmetadata", handleMetadata);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    if (!hasVideos) {
      timerRef.current = setTimeout(advanceClip, 1500);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [phase, currentClip, hasVideos, advanceClip]);

  const handleYes = () => {
    setPhase("response");
  };

  const handleNo = () => {
    setNoPressed(true);
    setTimeout(() => setNoPressed(false), 2000);
  };

  if (phase === "montage") {
    const round = ROUNDS[currentClip];
    const clip = MONTAGE_CLIPS[currentClip];
    return (
      <div className="fixed inset-0 bg-black">
        {hasVideos && clip ? (
          <video
            ref={videoRef}
            key={currentClip}
            src={clip.src}
            playsInline
            className="w-full h-full object-cover"
            onEnded={advanceClip}
            onError={() => setHasVideos(false)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <img
              src={getProfileUrl(round.startActress.profilePath, "w500")}
              alt={round.clipActress}
              className="w-24 h-24 rounded-full object-cover"
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
            className="font-serif text-5xl font-bold italic"
            style={{
              color: "#fff",
              textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.5)",
            }}
          >
            {round.word}
          </span>
        </div>

        {/* Clip counter */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <p
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {currentClip + 1} / {ROUNDS.length}
          </p>
        </div>
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
        {/* Actress portraits with words — spans 60% of viewport */}
        <div className="flex justify-between" style={{ width: "60vw" }}>
          {ROUNDS.map((round) => (
            <div key={round.number} className="flex flex-col items-center gap-3">
              <div
                className="rounded-full overflow-hidden"
                style={{
                  width: "10vw",
                  height: "10vw",
                  border: "2px solid var(--color-accent)",
                }}
              >
                <img
                  src={getProfileUrl(round.startActress.profilePath, "w500")}
                  alt={round.clipActress}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="font-serif text-4xl font-bold italic"
                style={{ color: "var(--color-accent)" }}
              >
                {round.word}
              </span>
            </div>
          ))}
        </div>

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
  const hearts = Array.from({ length: 18 }, (_, i) => ({
    left: `${5 + Math.random() * 90}%`,
    delay: `${i * 0.4 + Math.random() * 0.5}s`,
    duration: `${4 + Math.random() * 3}s`,
    size: `${18 + Math.random() * 16}px`,
    drift: `${(Math.random() - 0.5) * 80}px`,
  }));

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 relative overflow-hidden"
      style={{
        background: "var(--color-reveal-bg)",
        color: "var(--color-reveal-text)",
      }}
    >
      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {hearts.map((h, i) => (
          <span
            key={i}
            className="absolute bottom-0"
            style={{
              left: h.left,
              fontSize: h.size,
              animation: `heart-float ${h.duration} ease-out ${h.delay} infinite`,
              "--heart-drift": h.drift,
            } as React.CSSProperties}
          >
            {"♥"}
          </span>
        ))}
      </div>

      <h1
        className="font-serif text-5xl font-bold italic text-center leading-tight relative z-10"
        style={{ color: "var(--color-accent)" }}
      >
        Happy Valentine&apos;s Day
      </h1>
      <p
        className="text-xs uppercase tracking-[0.2em] relative z-10"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Love, your boobaloo
      </p>
    </div>
  );
}
