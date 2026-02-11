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
    <div className="flex flex-col items-center w-full gap-6">
      {/* Round label + target */}
      <div className="text-center">
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Round {round.number}
        </p>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Connect <span style={{ color: "var(--color-text)" }}>{round.startActress.name}</span> to{" "}
          <span style={{ color: "var(--color-accent)" }}>{round.endActress.name}</span>
        </p>
      </div>

      {/* Horizontal chain strip */}
      <ChainDisplay
        chain={chain}
        currentSearchMode={currentSearchMode}
        targetActress={round.endActress}
        isComplete={false}
      />

      {/* Soft limit warning */}
      {showSoftLimit && (
        <p
          className="text-xs text-center"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Long chain — try a different path?
        </p>
      )}

      {/* Search bar — left-aligned under chain */}
      <div className="w-full px-4 max-w-sm self-start">
        <SearchInput
          mode={currentSearchMode}
          placeholder={placeholder}
          onSelectMedia={handleSelectMedia}
          onSelectPerson={handleSelectPerson}
          disabled={isValidating}
          excludeActorIds={excludeActorIds}
        />
      </div>

      {/* Validation state */}
      {isValidating && (
        <p
          className="text-xs uppercase tracking-[0.15em]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Checking...
        </p>
      )}

      {/* Error */}
      {error && (
        <p
          className="text-xs text-center max-w-[280px]"
          style={{ color: "var(--color-error)" }}
        >
          {error}
        </p>
      )}

      {/* Undo / Reset */}
      {chain.length > 1 && (
        <div className="flex gap-4">
          <button
            onClick={() => {
              dispatch({ type: "UNDO_LAST" });
              setError(null);
            }}
            className="text-xs uppercase tracking-[0.15em] py-1.5 transition-colors"
            style={{
              color: "var(--color-text-secondary)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            Undo
          </button>
          <button
            onClick={() => {
              dispatch({ type: "RESET_CHAIN" });
              setError(null);
            }}
            className="text-xs uppercase tracking-[0.15em] py-1.5 transition-colors"
            style={{
              color: "var(--color-text-secondary)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
