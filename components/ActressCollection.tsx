"use client";

import { useGame } from "@/lib/GameContext";
import { getProfileUrl } from "@/lib/game-data";

export function ActressCollection() {
  const { state } = useGame();
  const { rounds, completedRounds } = state;

  return (
    <div className="flex justify-center gap-4 px-4 py-4">
      {rounds.map((round, i) => {
        const isCompleted = completedRounds.includes(i);
        const actress = round.startActress;

        return (
          <div key={round.number} className="flex flex-col items-center gap-1.5">
            <div
              className="w-10 h-10 rounded-full overflow-hidden transition-all duration-700"
              style={{
                border: isCompleted
                  ? "1.5px solid var(--color-accent)"
                  : "1.5px solid var(--color-border)",
                opacity: isCompleted ? 1 : 0.4,
              }}
            >
              {actress.profilePath ? (
                <img
                  src={getProfileUrl(actress.profilePath, "w45")}
                  alt={actress.name}
                  className="w-full h-full object-cover"
                  style={{
                    filter: isCompleted
                      ? "none"
                      : "grayscale(100%) brightness(0.3)",
                  }}
                />
              ) : (
                <div className="w-full h-full" style={{ background: "var(--color-surface)" }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
