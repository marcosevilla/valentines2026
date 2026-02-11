"use client";

import { useEffect } from "react";
import { GameProvider, useGame } from "@/lib/GameContext";
import { getRoundAccent } from "@/lib/game-data";
import { IntroScreen } from "@/components/screens/IntroScreen";
import { RoundScreen } from "@/components/screens/RoundScreen";
import { CelebrationScreen } from "@/components/screens/CelebrationScreen";

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

  switch (state.phase) {
    case "intro":
      return <IntroScreen />;
    case "playing":
      return <RoundScreen />;
    case "celebration":
      return <CelebrationScreen />;
  }
}

export function Game() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
