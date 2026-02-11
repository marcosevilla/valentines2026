"use client";

import { useGame } from "@/lib/GameContext";
import { ActressCollection } from "@/components/ActressCollection";
import { VideoClip } from "@/components/round/VideoClip";
import { ChainBuilder } from "@/components/round/ChainBuilder";
import { RoundComplete } from "@/components/round/RoundComplete";

export function RoundScreen() {
  const { state, dispatch } = useGame();
  const { roundState, rounds, currentRound } = state;
  const round = rounds[currentRound];

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Actress collection bar */}
      <ActressCollection />

      {/* Round content */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        {roundState.phase === "clip" && (
          <VideoClip
            round={round}
            onContinue={() => dispatch({ type: "SKIP_CLIP" })}
          />
        )}

        {roundState.phase === "chain" && <ChainBuilder />}

        {roundState.phase === "won" && <RoundComplete />}
      </div>
    </div>
  );
}
