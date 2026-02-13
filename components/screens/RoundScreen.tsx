"use client";

import { useGame } from "@/lib/GameContext";
import { VideoClip } from "@/components/round/VideoClip";
import { ChainBuilder } from "@/components/round/ChainBuilder";
import { RoundComplete } from "@/components/round/RoundComplete";

export function RoundScreen() {
  const { state, dispatch } = useGame();
  const { roundState, rounds, currentRound } = state;
  const round = rounds[currentRound];

  if (roundState.phase === "clip") {
    return (
      <div className="min-h-dvh grain-bg">
        <VideoClip
          round={round}
          onContinue={() => dispatch({ type: "SKIP_CLIP" })}
        />
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col grain-bg">
      {roundState.phase === "chain" ? (
        <div className="flex-1 flex flex-col">
          <ChainBuilder key={currentRound} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          {roundState.phase === "won" && <RoundComplete />}
        </div>
      )}
    </div>
  );
}
