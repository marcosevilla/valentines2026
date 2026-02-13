"use client";

import { useEffect } from "react";
import { GameProvider, useGame } from "@/lib/GameContext";
import { getRoundAccent } from "@/lib/game-data";
import { IntroScreen } from "@/components/screens/IntroScreen";
import { RoundScreen } from "@/components/screens/RoundScreen";
import { CelebrationScreen } from "@/components/screens/CelebrationScreen";
import { BackgroundMusic } from "@/components/BackgroundMusic";

function GameContent() {
  const { state } = useGame();

  // Update accent color CSS variable based on current round
  useEffect(() => {
    if (state.phase === "playing") {
      document.documentElement.style.setProperty(
        "--color-accent",
        getRoundAccent(state.currentRound),
      );
    } else if (state.phase === "celebration") {
      document.documentElement.style.setProperty(
        "--color-accent",
        "#E8547C",
      );
    } else {
      document.documentElement.style.setProperty(
        "--color-accent",
        "#E63946",
      );
    }
  }, [state.phase, state.currentRound]);

  const musicPlaying = state.phase !== "intro";
  const musicDucked =
    state.phase === "playing" && state.roundState.phase === "clip";
  const musicVolume = state.phase === "celebration" ? 0.95 : undefined;

  return (
    <>
      <BackgroundMusic playing={musicPlaying} ducked={musicDucked} volume={musicVolume} />
      {state.phase === "intro" && <IntroScreen />}
      {state.phase === "playing" && <RoundScreen />}
      {state.phase === "celebration" && <CelebrationScreen />}
    </>
  );
}

export function Game() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
