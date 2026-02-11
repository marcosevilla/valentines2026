import { GameState, GameAction, RoundState } from "./types";
import { ROUNDS } from "./game-data";

function createInitialRoundState(roundIndex: number): RoundState {
  const round = ROUNDS[roundIndex];
  return {
    phase: "chain",
    chain: [
      {
        type: "actor",
        id: round.startActress.id,
        name: round.startActress.name,
        profilePath: round.startActress.profilePath,
      },
    ],
    currentSearchMode: "media",
    selectedMedia: null,
  };
}

export const initialGameState: GameState = {
  phase: "intro",
  currentRound: 0,
  rounds: ROUNDS,
  roundState: createInitialRoundState(0),
  completedRounds: [],
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        phase: "playing",
        currentRound: 0,
        roundState: createInitialRoundState(0),
        completedRounds: [],
      };

    case "SKIP_CLIP":
      return {
        ...state,
        roundState: {
          ...state.roundState,
          phase: "chain",
        },
      };

    case "SELECT_MEDIA":
      return {
        ...state,
        roundState: {
          ...state.roundState,
          chain: [
            ...state.roundState.chain,
            {
              type: "media",
              id: action.media.id,
              name: action.media.title,
              mediaType: action.media.mediaType,
              posterPath: action.media.posterPath,
            },
          ],
          currentSearchMode: "person",
          selectedMedia: action.media,
        },
      };

    case "SELECT_PERSON": {
      const round = state.rounds[state.currentRound];
      const isTarget = action.person.id === round.endActress.id;

      const newChain = [
        ...state.roundState.chain,
        {
          type: "actor" as const,
          id: action.person.id,
          name: action.person.name,
          profilePath: action.person.profilePath,
        },
      ];

      if (isTarget) {
        return {
          ...state,
          roundState: {
            ...state.roundState,
            chain: newChain,
            phase: "won",
            currentSearchMode: "media",
            selectedMedia: null,
          },
          completedRounds: [...state.completedRounds, state.currentRound],
        };
      }

      return {
        ...state,
        roundState: {
          ...state.roundState,
          chain: newChain,
          currentSearchMode: "media",
          selectedMedia: null,
        },
      };
    }

    case "NEXT_ROUND": {
      const nextRound = state.currentRound + 1;
      if (nextRound >= ROUNDS.length) {
        return {
          ...state,
          phase: "celebration",
        };
      }
      return {
        ...state,
        currentRound: nextRound,
        roundState: createInitialRoundState(nextRound),
      };
    }

    case "UNDO_LAST": {
      if (state.roundState.chain.length <= 1) return state;

      const newChain = state.roundState.chain.slice(0, -1);
      const lastLink = newChain[newChain.length - 1];

      // If we removed an actor, we're back to selecting a person for the previous media
      // If we removed a media, we're back to selecting a media for the previous actor
      const newSearchMode = lastLink.type === "actor" ? "media" : "person";
      const newSelectedMedia =
        newSearchMode === "person" && lastLink.type === "media"
          ? {
              id: lastLink.id,
              title: lastLink.name,
              year: "",
              posterPath: lastLink.posterPath ?? null,
              mediaType: lastLink.mediaType!,
            }
          : null;

      return {
        ...state,
        roundState: {
          ...state.roundState,
          chain: newChain,
          currentSearchMode: newSearchMode as "media" | "person",
          selectedMedia: newSelectedMedia,
        },
      };
    }

    case "RESET_CHAIN":
      return {
        ...state,
        roundState: {
          ...state.roundState,
          chain: [state.roundState.chain[0]],
          currentSearchMode: "media",
          selectedMedia: null,
        },
      };

    default:
      return state;
  }
}
