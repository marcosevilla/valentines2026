"use client";

import { useGame } from "@/lib/GameContext";

export function IntroScreen() {
  const { dispatch } = useGame();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-12 px-6">
      <div className="text-center space-y-3">
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          A game of connections
        </p>
        <h1
          className="text-5xl font-bold tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          Scream Queens
        </h1>
        <p
          className="text-sm uppercase tracking-[0.15em]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Six Degrees
        </p>
      </div>

      <p
        className="text-sm text-center max-w-[280px] leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Connect two actresses through the movies and shows they share with other actors.
      </p>

      <button
        onClick={() => dispatch({ type: "START_GAME" })}
        className="px-10 py-3 text-sm uppercase tracking-[0.15em] font-medium transition-all active:scale-95"
        style={{
          background: "var(--color-accent)",
          color: "#fff",
          border: "none",
        }}
      >
        Start
      </button>
    </div>
  );
}
