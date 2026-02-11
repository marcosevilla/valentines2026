// TMDb API response types

export interface TMDbMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

export interface TMDbTVShow {
  id: number;
  name: string;
  first_air_date: string;
  poster_path: string | null;
}

export interface TMDbPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

export interface TMDbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

// Normalized types used in the game

export interface MediaResult {
  id: number;
  title: string;
  year: string;
  posterPath: string | null;
  mediaType: "movie" | "tv";
}

export interface PersonResult {
  id: number;
  name: string;
  profilePath: string | null;
}

// Game types

export interface ChainLink {
  type: "actor" | "media";
  id: number;
  name: string;
  mediaType?: "movie" | "tv";
  profilePath?: string | null;
  posterPath?: string | null;
}

export interface RoundConfig {
  number: 1 | 2 | 3 | 4 | 5;
  clipUrl: string;
  clipActress: string;
  clipMovie: string;
  startActress: { id: number; name: string; profilePath: string };
  endActress: { id: number; name: string; profilePath: string };
  word: string;
}

export type SearchMode = "media" | "person";

export type GamePhase = "intro" | "playing" | "celebration";

export type RoundPhase = "clip" | "chain" | "won";

export interface RoundState {
  phase: RoundPhase;
  chain: ChainLink[];
  currentSearchMode: SearchMode;
  selectedMedia: MediaResult | null;
}

export interface GameState {
  phase: GamePhase;
  currentRound: number;
  rounds: RoundConfig[];
  roundState: RoundState;
  completedRounds: number[];
}

export type GameAction =
  | { type: "START_GAME" }
  | { type: "SKIP_CLIP" }
  | { type: "SELECT_MEDIA"; media: MediaResult }
  | { type: "SELECT_PERSON"; person: PersonResult }
  | { type: "ROUND_WON" }
  | { type: "NEXT_ROUND" }
  | { type: "UNDO_LAST" }
  | { type: "RESET_CHAIN" };
