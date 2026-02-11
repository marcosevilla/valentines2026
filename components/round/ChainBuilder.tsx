"use client";

import { useState, useMemo } from "react";
import { useGame } from "@/lib/GameContext";
import { validateConnection } from "@/lib/tmdb";
import { MediaResult, PersonResult } from "@/lib/types";
import { CHAIN_SOFT_LIMIT } from "@/lib/game-data";
import { SearchInput } from "./SearchInput";
import { ChainDisplay } from "./ChainDisplay";

export function ChainBuilder() {
  const { state, dispatch } = useGame();
  const { roundState, rounds, currentRound } = state;
  const { chain, currentSearchMode, selectedMedia } = roundState;
  const round = rounds[currentRound];

  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const currentActor = chain.length > 0 ? chain[chain.length - 1] : null;
  const showSoftLimit = chain.length >= CHAIN_SOFT_LIMIT;

  const excludeActorIds = useMemo(
    () => chain.filter((l) => l.type === "actor").map((l) => l.id),
    [chain],
  );

  const handleSelectMedia = async (media: MediaResult) => {
    if (!currentActor) return;
    setError(null);
    setIsValidating(true);

    const valid = await validateConnection(
      currentActor.id,
      media.id,
      media.mediaType,
    );

    setIsValidating(false);

    if (!valid) {
      setError(`${currentActor.name} doesn't appear in ${media.title}`);
      return;
    }

    dispatch({ type: "SELECT_MEDIA", media });
  };

  const handleSelectPerson = async (person: PersonResult) => {
    if (!selectedMedia) return;
    setError(null);
    setIsValidating(true);

    const valid = await validateConnection(
      person.id,
      selectedMedia.id,
      selectedMedia.mediaType,
    );

    setIsValidating(false);

    if (!valid) {
      setError(`${person.name} doesn't appear in ${selectedMedia.title}`);
      return;
    }

    dispatch({ type: "SELECT_PERSON", person });
  };

  const placeholder =
    currentSearchMode === "media"
      ? `What was ${currentActor?.name} in?`
      : `Who else was in ${selectedMedia?.title}?`;

  return (
    <div className="flex flex-col w-full flex-1">
      {/* Round header */}
      <h1
        className="text-3xl uppercase tracking-[0.05em] font-bold text-center pt-6 pb-4"
        style={{ color: "var(--color-text)" }}
      >
        Round {round.number}
      </h1>

      {/* Spacer above chain — pushes chain to vertical center */}
      <div className="flex-[0.8]" />

      {/* Horizontal chain strip + search bar below */}
      <ChainDisplay
        chain={chain}
        currentSearchMode={currentSearchMode}
        targetActress={round.endActress}
        isComplete={false}
        onUndo={() => {
          dispatch({ type: "UNDO_LAST" });
          setError(null);
        }}
      >
        <div className="max-w-[240px] w-full">
          <SearchInput
            mode={currentSearchMode}
            placeholder={placeholder}
            onSelectMedia={handleSelectMedia}
            onSelectPerson={handleSelectPerson}
            disabled={isValidating}
            excludeActorIds={excludeActorIds}
          />

          {/* Validation state */}
          {isValidating && (
            <p
              className="text-xs uppercase tracking-[0.15em] mt-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Checking...
            </p>
          )}

          {/* Error */}
          {error && (
            <p
              className="text-xs mt-2 max-w-[280px]"
              style={{ color: "var(--color-error)" }}
            >
              {error}
            </p>
          )}
        </div>
      </ChainDisplay>

      {/* Soft limit warning */}
      {showSoftLimit && (
        <p
          className="text-xs text-center"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Long chain — try a different path?
        </p>
      )}

      {/* Spacer pushes Start over to bottom */}
      <div className="flex-[0.8]" />

      {/* Reset chain */}
      {chain.length > 1 && (
        <button
          onClick={() => {
            dispatch({ type: "RESET_CHAIN" });
            setError(null);
          }}
          className="text-xs uppercase tracking-[0.15em] py-1.5 transition-colors self-center mb-2"
          style={{
            color: "var(--color-text-secondary)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          Start over
        </button>
      )}
    </div>
  );
}
