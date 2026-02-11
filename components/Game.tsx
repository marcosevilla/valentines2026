"use client";

import { GameProvider, useGame } from "@/lib/GameContext";
import { IntroScreen } from "@/components/screens/IntroScreen";
import { RoundScreen } from "@/components/screens/RoundScreen";
import { CelebrationScreen } from "@/components/screens/CelebrationScreen";

function GameContent() {
  const { state } = useGame();

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
