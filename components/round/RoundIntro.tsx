"use client";

import { useState, useEffect } from "react";
import { RoundConfig } from "@/lib/types";
import { getProfileUrl } from "@/lib/game-data";

interface RoundIntroProps {
  round: RoundConfig;
  onComplete: () => void;
}

export function RoundIntro({ round, onComplete }: RoundIntroProps) {
  const [phase, setPhase] = useState(0);
  // 0: nothing visible
  // 1: round label appears
  // 2: actress 1 appears
  // 3: actress 2 slides in
  // 4: transition out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 400),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2800),
      setTimeout(() => onComplete(), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8">
      {/* Round label */}
      <p
        className="text-lg uppercase tracking-[0.3em] font-medium transition-all duration-500"
        style={{
          color: "var(--color-text)",
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0)" : "translateY(12px)",
        }}
      >
        Round {round.number}
      </p>

      {/* Actress portraits */}
      <div className="flex items-center gap-8">
        {/* Actress 1 */}
        <div
          className="flex flex-col items-center gap-3 transition-all duration-700"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform:
              phase >= 4
                ? "translateX(-40px) scale(0.6)"
                : phase >= 2
                  ? "translateX(0) scale(1)"
                  : "translateX(0) scale(0.9)",
          }}
        >
          <div
            className="w-[30dvh] aspect-[3/4] overflow-hidden"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <img
              src={getProfileUrl(round.startActress.profilePath, "w185")}
              alt={round.startActress.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="text-sm uppercase tracking-[0.15em]"
            style={{ color: "var(--color-text)" }}
          >
            {round.startActress.name}
          </span>
        </div>

        {/* Actress 2 */}
        <div
          className="flex flex-col items-center gap-3 transition-all duration-700"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform:
              phase >= 4
                ? "translateX(40px) scale(0.6)"
                : phase >= 3
                  ? "translateX(0) scale(1)"
                  : "translateX(60px) scale(0.9)",
          }}
        >
          <div
            className="w-[30dvh] aspect-[3/4] overflow-hidden"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <img
              src={getProfileUrl(round.endActress.profilePath, "w185")}
              alt={round.endActress.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="text-sm uppercase tracking-[0.15em]"
            style={{ color: "var(--color-accent)" }}
          >
            {round.endActress.name}
          </span>
        </div>
      </div>

      {/* Fade out overlay */}
      {phase >= 4 && (
        <div
          className="fixed inset-0 z-50 transition-opacity duration-500"
          style={{
            background: "var(--color-bg)",
            opacity: phase >= 4 ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}
