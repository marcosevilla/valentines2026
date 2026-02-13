"use client";

import { useState, useRef, useCallback } from "react";
import { RoundConfig } from "@/lib/types";

interface VideoClipProps {
  round: RoundConfig;
  onContinue: () => void;
}

export function VideoClip({ round, onContinue }: VideoClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadingOut, setFadingOut] = useState(false);

  const handleEnded = useCallback(() => {
    setFadingOut(true);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (fadingOut) {
      onContinue();
    }
  }, [fadingOut, onContinue]);

  // If video fails to load, skip straight to chain phase
  const handleError = useCallback(() => {
    onContinue();
  }, [onContinue]);

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <video
        ref={videoRef}
        src={round.clipUrl}
        autoPlay
        playsInline
        className={`max-w-full max-h-[80dvh] object-contain ${
          fadingOut ? "clip-fade-out" : "clip-fade-in"
        }`}
        onEnded={handleEnded}
        onError={handleError}
        onAnimationEnd={handleAnimationEnd}
      />
    </div>
  );
}
