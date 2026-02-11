"use client";

import { useState, useEffect, useCallback } from "react";
import { useGame } from "@/lib/GameContext";
import { VideoClip } from "@/components/round/VideoClip";
import { ChainBuilder } from "@/components/round/ChainBuilder";
import { RoundComplete } from "@/components/round/RoundComplete";
import { RoundIntro } from "@/components/round/RoundIntro";

export function RoundScreen() {
  const { state, dispatch } = useGame();
  const { roundState, rounds, currentRound } = state;
  const round = rounds[currentRound];
  const [showIntro, setShowIntro] = useState(false);

  // Show intro when entering chain phase
  useEffect(() => {
    if (roundState.phase === "chain") {
      setShowIntro(true);
    }
  }, [roundState.phase, currentRound]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col grain-bg">
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        {roundState.phase === "clip" && (
          <VideoClip
            round={round}
            onContinue={() => dispatch({ type: "SKIP_CLIP" })}
          />
        )}

        {roundState.phase === "chain" && showIntro && (
          <RoundIntro round={round} onComplete={handleIntroComplete} />
        )}

        {roundState.phase === "chain" && !showIntro && <ChainBuilder />}

        {roundState.phase === "won" && <RoundComplete />}
      </div>
    </div>
  );
}
