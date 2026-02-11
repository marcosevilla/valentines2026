"use client";

import { useGame } from "@/lib/GameContext";
import { getFeedbackMessage } from "@/lib/game-data";

export function RoundComplete() {
  const { state, dispatch } = useGame();
  const { roundState, rounds, currentRound } = state;
  const round = rounds[currentRound];
  const feedback = getFeedbackMessage(roundState.chain.length);
  const isLastRound = currentRound >= rounds.length - 1;

  return (
    <div className="flex flex-col items-center gap-6 px-6">
      <div
        className="text-3xl font-bold"
        style={{ color: "var(--color-accent)" }}
      >
        {feedback}
      </div>

      <div className="text-center">
        <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          You connected {round.startActress.name} to {round.endActress.name} in{" "}
          {Math.floor(roundState.chain.length / 2)} step
          {Math.floor(roundState.chain.length / 2) !== 1 ? "s" : ""}
        </div>
      </div>

      <button
        onClick={() => dispatch({ type: "NEXT_ROUND" })}
        className="px-6 py-2.5 rounded-full text-sm font-semibold transition-transform active:scale-95"
        style={{
          background: "var(--color-accent)",
          color: "#fff",
        }}
      >
        {isLastRound ? "See your message" : `Round ${currentRound + 2}`}
      </button>
    </div>
  );
}
