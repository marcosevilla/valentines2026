"use client";

import { useGame } from "@/lib/GameContext";
import { getProfileUrl } from "@/lib/game-data";

export function ActressCollection() {
  const { state } = useGame();
  const { rounds, completedRounds } = state;

  return (
    <div className="flex justify-center gap-3 px-4 py-3">
      {rounds.map((round, i) => {
        const isCompleted = completedRounds.includes(i);
        const actress = round.startActress;

        return (
          <div
            key={round.number}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-11 h-11 rounded-full overflow-hidden transition-all duration-500"
              style={{
                border: isCompleted
                  ? "2px solid var(--color-accent)"
                  : "2px solid rgba(255,255,255,0.1)",
                opacity: isCompleted ? 1 : 0.3,
              }}
            >
              {actress.profilePath ? (
                <img
                  src={getProfileUrl(actress.profilePath, "w45")}
                  alt={actress.name}
                  className="w-full h-full object-cover"
                  style={{
                    filter: isCompleted ? "none" : "grayscale(100%) brightness(0.3)",
                  }}
                />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
