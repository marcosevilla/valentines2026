"use client";

import { getProfileUrl, getPosterUrl } from "@/lib/game-data";

interface ChainCardProps {
  variant: "start" | "end" | "actor" | "media" | "placeholder";
  name?: string;
  imagePath?: string | null;
  mediaType?: "movie" | "tv";
  searchMode?: "media" | "person";
  isActive?: boolean;
  isNew?: boolean;
  waveDelay?: number;
  isWaving?: boolean;
  heightDvh?: number;
}

export function ChainCard({
  variant,
  name,
  imagePath,
  mediaType,
  searchMode,
  isActive = false,
  isNew = false,
  waveDelay = 0,
  isWaving = false,
  heightDvh,
}: ChainCardProps) {
  const isBookend = variant === "start" || variant === "end";
  const h = heightDvh ?? (isBookend ? 50 : 35);

  if (variant === "placeholder") {
    return (
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0 placeholder-appear">
        <div
          className="aspect-[3/4] flex items-center justify-center"
          style={{
            height: `${h * 0.7}dvh`,
            border: "1.5px dashed var(--color-border)",
            background: "var(--color-surface)",
            transition: "height 0.5s ease",
          }}
        >
          {searchMode === "media" ? <FilmIcon /> : <PersonIcon />}
        </div>
      </div>
    );
  }

  let imgSrc = "";
  if (variant === "start" || variant === "end" || variant === "actor") {
    imgSrc = imagePath ? getProfileUrl(imagePath, "w185") : "";
  } else {
    imgSrc = imagePath ? getPosterUrl(imagePath, "w154") : "";
  }

  return (
    <div
      className={`flex flex-col items-center gap-1.5 flex-shrink-0 ${isNew ? "card-flip-in" : ""} ${isWaving ? "card-wave" : ""}`}
      style={isWaving ? { animationDelay: `${waveDelay}ms` } : undefined}
    >
      <div
        className="aspect-[3/4] overflow-hidden"
        style={{
          height: `${h}dvh`,
          border: isActive
            ? "1.5px solid var(--color-accent)"
            : "1px solid var(--color-border)",
          transition: "all 0.5s ease",
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name || ""}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: "var(--color-surface)" }}
          />
        )}
      </div>
      {name && (
        <span
          className="text-[10px] uppercase tracking-[0.08em] text-center truncate max-w-[100px]"
          style={{ color: "var(--color-text)" }}
        >
          {name}
        </span>
      )}
    </div>
  );
}

function ChainConnector({ confirmed = true }: { confirmed?: boolean }) {
  return (
    <svg
      width="24"
      height="48"
      viewBox="0 0 24 48"
      className="flex-shrink-0 mx-0.5"
    >
      <path
        d="M 0 24 C 7 10, 17 38, 24 24"
        stroke={confirmed ? "var(--color-accent)" : "var(--color-border)"}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { ChainConnector };

function FilmIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-text-secondary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="1" />
      <path d="M7 2v20M17 2v20M2 7h5M17 7h5M2 12h20M2 17h5M17 17h5" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-text-secondary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
    </svg>
  );
}
