"use client";

import { useGame } from "@/lib/GameContext";

export function IntroScreen() {
  const { dispatch } = useGame();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: "var(--color-accent)" }}
        >
          Scream Queens
        </h1>
        <p
          className="text-lg"
          style={{ color: "var(--color-text-muted)" }}
        >
          Six Degrees
        </p>
      </div>

      <div
        className="text-center text-sm max-w-xs leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        Connect two actresses through the movies and shows they share with other actors. Find the link!
      </div>

      <button
        onClick={() => dispatch({ type: "START_GAME" })}
        className="px-8 py-3 rounded-full text-base font-semibold transition-transform active:scale-95"
        style={{
          background: "var(--color-accent)",
          color: "#fff",
        }}
      >
        Start
      </button>
    </div>
  );
}
