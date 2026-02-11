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

  // Collect all actor IDs in the chain to prevent loops
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
    <div className="flex flex-col items-center gap-4 w-full px-4">
      {/* Target */}
      <div className="text-center">
        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
          Connect to
        </span>
        <div className="text-lg font-semibold" style={{ color: "var(--color-accent)" }}>
          {round.endActress.name}
        </div>
      </div>

      {/* Chain */}
      <div className="w-full max-h-48 overflow-y-auto">
        <ChainDisplay chain={chain} />
      </div>

      {/* Soft limit warning */}
      {showSoftLimit && (
        <div
          className="text-xs text-center px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(233, 69, 96, 0.15)", color: "var(--color-accent-soft)" }}
        >
          Long chain! Maybe try a different path?
        </div>
      )}

      {/* Search */}
      <div className="w-full">
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
        <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Checking...
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="text-sm text-center px-3 py-2 rounded-lg w-full"
          style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--color-error)" }}
        >
          {error}
        </div>
      )}

      {/* Undo / Reset */}
      {chain.length > 1 && (
        <div className="flex gap-3">
          <button
            onClick={() => {
              dispatch({ type: "UNDO_LAST" });
              setError(null);
            }}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "var(--color-text-muted)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Undo
          </button>
          <button
            onClick={() => {
              dispatch({ type: "RESET_CHAIN" });
              setError(null);
            }}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "var(--color-text-muted)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
