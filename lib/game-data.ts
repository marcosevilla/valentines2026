import { RoundConfig } from "./types";

// TMDb person IDs — verified via TMDb API on 2026-02-10
export const ACTRESS_IDS = {
  toniCollette: 3051,
  florencePugh: 1373737,
  jennaOrtega: 974169,
  samaraWeaving: 1372369,
  naomiScott: 240724,
} as const;

// TMDb image base URL
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function getProfileUrl(path: string | null, size = "w185"): string {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getPosterUrl(path: string | null, size = "w154"): string {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export const ROUNDS: RoundConfig[] = [
  {
    number: 1,
    clipUrl: "/clips/round-1.mp4",
    clipActress: "Toni Collette",
    clipMovie: "Hereditary",
    startActress: {
      id: ACTRESS_IDS.toniCollette,
      name: "Toni Collette",
      profilePath: "/lzXRh16qe4HHeBN6tMyw0DHvaMn.jpg",
    },
    endActress: {
      id: ACTRESS_IDS.florencePugh,
      name: "Florence Pugh",
      profilePath: "/1Uvfh7xL4U2evkhs0M3C7BbBYFf.jpg",
    },
    word: "Will",
  },
  {
    number: 2,
    clipUrl: "/clips/round-2.mp4",
    clipActress: "Florence Pugh",
    clipMovie: "Midsommar",
    startActress: {
      id: ACTRESS_IDS.florencePugh,
      name: "Florence Pugh",
      profilePath: "/1Uvfh7xL4U2evkhs0M3C7BbBYFf.jpg",
    },
    endActress: {
      id: ACTRESS_IDS.jennaOrtega,
      name: "Jenna Ortega",
      profilePath: "/cV4x7jNmsGLdKZn5I6xVF3Ltnmg.jpg",
    },
    word: "you",
  },
  {
    number: 3,
    clipUrl: "/clips/round-3.mp4",
    clipActress: "Jenna Ortega",
    clipMovie: "X",
    startActress: {
      id: ACTRESS_IDS.jennaOrtega,
      name: "Jenna Ortega",
      profilePath: "/cV4x7jNmsGLdKZn5I6xVF3Ltnmg.jpg",
    },
    endActress: {
      id: ACTRESS_IDS.samaraWeaving,
      name: "Samara Weaving",
      profilePath: "/7ThO37CpqkBRgrosep0ROVs2q5s.jpg",
    },
    word: "be",
  },
  {
    number: 4,
    clipUrl: "/clips/round-4.mp4",
    clipActress: "Samara Weaving",
    clipMovie: "Ready or Not",
    startActress: {
      id: ACTRESS_IDS.samaraWeaving,
      name: "Samara Weaving",
      profilePath: "/7ThO37CpqkBRgrosep0ROVs2q5s.jpg",
    },
    endActress: {
      id: ACTRESS_IDS.naomiScott,
      name: "Naomi Scott",
      profilePath: "/knSGMaEaH6CZaYw7GQpvxyJcsz7.jpg",
    },
    word: "my",
  },
  {
    number: 5,
    clipUrl: "/clips/round-5.mp4",
    clipActress: "Naomi Scott",
    clipMovie: "Smile 2",
    startActress: {
      id: ACTRESS_IDS.naomiScott,
      name: "Naomi Scott",
      profilePath: "/knSGMaEaH6CZaYw7GQpvxyJcsz7.jpg",
    },
    endActress: {
      id: ACTRESS_IDS.toniCollette,
      name: "Toni Collette",
      profilePath: "/lzXRh16qe4HHeBN6tMyw0DHvaMn.jpg",
    },
    word: "Valentine?",
  },
];

// Accent color per round — subtle shift from blood red to coral pink
export const ROUND_ACCENTS: Record<number, string> = {
  0: "#E63946", // blood red
  1: "#D94060", // warming
  2: "#CC4D7A", // entering rose
  3: "#BF5A94", // berry
  4: "#E8547C", // coral pink
};

export function getRoundAccent(roundIndex: number): string {
  return ROUND_ACCENTS[roundIndex] ?? "#E63946";
}

export function getFeedbackMessage(chainLength: number): string {
  const movieCount = Math.floor(chainLength / 2);
  if (movieCount <= 1) return "Incredible!";
  if (movieCount === 2) return "Amazing!";
  if (movieCount === 3) return "Nice!";
  return "You got it!";
}

export const CHAIN_SOFT_LIMIT = 10;
