"use client";

import { useGame } from "@/lib/GameContext";
import { getFeedbackMessage } from "@/lib/game-data";
import { ChainDisplay } from "./ChainDisplay";

export function RoundComplete() {
  const { state, dispatch } = useGame();
  const { roundState, rounds, currentRound } = state;
  const round = rounds[currentRound];
  const feedback = getFeedbackMessage(roundState.chain.length);
  const isLastRound = currentRound >= rounds.length - 1;
  const steps = Math.floor(roundState.chain.length / 2);

  return (
    <div className="flex flex-col items-center w-full gap-6">
      {/* Feedback */}
      <div className="text-center">
        <div
          className="text-2xl font-medium"
          style={{ color: "var(--color-accent)" }}
        >
          {feedback}
        </div>
        <p
          className="text-xs uppercase tracking-[0.15em] mt-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {round.startActress.name} to {round.endActress.name} in {steps} step
          {steps !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Completed chain — shows wave animation */}
      <ChainDisplay
        chain={roundState.chain}
        currentSearchMode="media"
        targetActress={round.endActress}
        isComplete={true}
      />

      {/* Continue button */}
      <button
        onClick={() => dispatch({ type: "NEXT_ROUND" })}
        className="fade-in-up flex items-center gap-2 px-8 py-2.5 text-sm uppercase tracking-[0.15em] font-medium transition-all active:scale-95"
        style={{
          background: "var(--color-accent)",
          color: "#fff",
          animationDelay: "0.8s",
        }}
      >
        {isLastRound ? "See your message" : `Round ${currentRound + 2}`}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
