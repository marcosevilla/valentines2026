"use client";

import { useState, useMemo, useEffect } from "react";
import { useGame } from "@/lib/GameContext";
import { validateConnection } from "@/lib/tmdb";
import { MediaResult, PersonResult } from "@/lib/types";
import { CHAIN_SOFT_LIMIT, getProfileUrl } from "@/lib/game-data";
import { playCardSound, playWinSound, playRemoveSound } from "@/lib/sounds";
import { SearchInput } from "./SearchInput";
import { ChainDisplay } from "./ChainDisplay";

export function ChainBuilder() {
  const { state, dispatch } = useGame();
  const { roundState, rounds, currentRound } = state;
  const { chain, currentSearchMode, selectedMedia } = roundState;
  const round = rounds[currentRound];

  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Intro animation — phases 0-5, absorbed from RoundIntro
  // 0: nothing visible
  // 1: round label fades in (centered via transform)
  // 2: actress 1 appears in overlay
  // 3: actress 2 slides in
  // 4: header transitions to top, overlay fades out, chain fades in
  // 5: intro complete, overlay removed
  const [introPhase, setIntroPhase] = useState(0);
  const introComplete = introPhase >= 5;

  useEffect(() => {
    const timers = [
      setTimeout(() => setIntroPhase(1), 100),
      setTimeout(() => setIntroPhase(2), 400),
      setTimeout(() => setIntroPhase(3), 1400),
      setTimeout(() => setIntroPhase(4), 2800),
      setTimeout(() => setIntroPhase(5), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

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

    playCardSound();
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

    if (person.id === round.endActress.id) {
      playWinSound();
    } else {
      playCardSound();
    }
    dispatch({ type: "SELECT_PERSON", person });
  };

  const placeholder =
    currentSearchMode === "media"
      ? `What was ${currentActor?.name} in?`
      : `Who else was in ${selectedMedia?.title}?`;

  return (
    <div className="flex flex-col w-full flex-1">
      {/* Round header — SHARED ELEMENT: same DOM node transitions from center to top */}
      <h1
        className="text-4xl uppercase font-bold text-center font-pixel"
        style={{
          color: "var(--color-text)",
          paddingTop: "3rem",
          paddingBottom: "1rem",
          opacity: introPhase >= 1 ? 1 : 0,
          transform:
            introPhase < 4
              ? "translateY(calc(28dvh - 3rem)) scale(0.5)"
              : "translateY(0) scale(1)",
          letterSpacing: introPhase < 4 ? "0.25em" : "0.05em",
          transition:
            introPhase < 1
              ? "opacity 0.4s ease-out"
              : "transform 0.8s ease-in-out, letter-spacing 0.8s ease-in-out, opacity 0.4s ease-out",
          transformOrigin: "center center",
        }}
      >
        Round {round.number}
      </h1>

      {/* Hangman-style word reveal */}
      <div
        className="flex items-center justify-center gap-3 pb-2"
        style={{
          opacity: introPhase >= 4 ? 1 : 0,
          transition: "opacity 0.6s ease-in-out 0.3s",
        }}
      >
        {rounds.map((r, i) => {
          const revealed = state.completedRounds.includes(i);
          return (
            <span
              key={i}
              className="text-sm uppercase tracking-[0.1em] text-center"
              style={{
                color: revealed ? "var(--color-text)" : "transparent",
                minWidth: "2.5rem",
                borderBottom: revealed ? "none" : "1.5px solid var(--color-text-secondary)",
                paddingBottom: revealed ? "0" : "2px",
                transition: "color 0.4s ease-out",
              }}
            >
              {revealed ? r.word : "\u00A0"}
            </span>
          );
        })}
      </div>

      {/* Intro portrait overlay — fades out as chain fades in */}
      {!introComplete && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center gap-8 pointer-events-none pt-[12dvh]"
          style={{
            opacity: introPhase >= 4 ? 0 : 1,
            transition: "opacity 0.6s ease-in-out",
          }}
        >
          {/* Actress 1 — drifts left during phase 4 crossfade */}
          <div
            className="flex flex-col items-center gap-3 transition-all ease-in-out"
            style={{
              opacity: introPhase >= 2 ? 1 : 0,
              transitionDuration: introPhase >= 4 ? "800ms" : "700ms",
              transform:
                introPhase >= 4
                  ? "translateX(-20vw) scale(0.6)"
                  : introPhase >= 2
                    ? "translateX(0) scale(1)"
                    : "translateX(0) scale(0.9)",
            }}
          >
            <div
              className="w-[30dvh] aspect-[3/4] overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <img
                src={getProfileUrl(round.startActress.profilePath, "w500")}
                alt={round.startActress.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="text-sm uppercase tracking-[0.15em] transition-opacity duration-500"
              style={{
                color: "var(--color-text)",
                opacity: introPhase >= 4 ? 0 : 1,
              }}
            >
              {round.startActress.name}
            </span>
          </div>

          {/* Actress 2 — drifts right during phase 4 crossfade */}
          <div
            className="flex flex-col items-center gap-3 transition-all ease-in-out"
            style={{
              opacity: introPhase >= 3 ? 1 : 0,
              transitionDuration: introPhase >= 4 ? "800ms" : "700ms",
              transform:
                introPhase >= 4
                  ? "translateX(20vw) scale(0.6)"
                  : introPhase >= 3
                    ? "translateX(0) scale(1)"
                    : "translateX(60px) scale(0.9)",
            }}
          >
            <div
              className="w-[30dvh] aspect-[3/4] overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <img
                src={getProfileUrl(round.endActress.profilePath, "w500")}
                alt={round.endActress.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="text-sm uppercase tracking-[0.15em] transition-opacity duration-500"
              style={{
                color: "var(--color-accent)",
                opacity: introPhase >= 4 ? 0 : 1,
              }}
            >
              {round.endActress.name}
            </span>
          </div>
        </div>
      )}

      {/* Spacer above chain — pushes chain to vertical center */}
      <div className="flex-[0.8]" />

      {/* Horizontal chain strip + search bar — fades in during phase 4 */}
      <div
        style={{
          opacity: introPhase >= 4 ? 1 : 0,
          transition: "opacity 0.6s ease-in-out 0.15s",
          pointerEvents: introComplete ? "auto" : "none",
        }}
      >
        <ChainDisplay
          chain={chain}
          currentSearchMode={currentSearchMode}
          targetActress={round.endActress}
          isComplete={false}
          onUndo={() => {
            playRemoveSound();
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
              disabled={isValidating || !introComplete}
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
      </div>

      {/* Soft limit warning */}
      {showSoftLimit && introComplete && (
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
      {introComplete && chain.length > 1 && (
        <button
          onClick={() => {
            dispatch({ type: "RESET_CHAIN" });
            setError(null);
          }}
          className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] px-4 py-1.5 rounded-full transition-colors self-center mb-2"
          style={{
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1v5h5" />
            <path d="M3.5 10a6 6 0 1 0 1.2-6.2L1 6" />
          </svg>
          Start over
        </button>
      )}
    </div>
  );
}
