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
  isNewest?: boolean;
  onRemove?: () => void;
  waveDelay?: number;
  isWaving?: boolean;
  heightDvh?: number;
  bobIndex?: number;
}

export function ChainCard({
  variant,
  name,
  imagePath,
  mediaType,
  searchMode,
  isActive = false,
  isNew = false,
  isNewest = false,
  onRemove,
  waveDelay = 0,
  isWaving = false,
  heightDvh,
  bobIndex = 0,
}: ChainCardProps) {
  const isBookend = variant === "start" || variant === "end";
  const h = heightDvh ?? (isBookend ? 30 : 21);

  if (variant === "placeholder") {
    return (
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0 placeholder-appear">
        <div
          className="aspect-[3/4] flex items-center justify-center"
          style={{
            height: `${h}dvh`,
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
    imgSrc = imagePath ? getProfileUrl(imagePath, "w500") : "";
  } else {
    imgSrc = imagePath ? getPosterUrl(imagePath, "w342") : "";
  }

  const shouldBob = !isBookend && !isNew && !isWaving && variant !== "placeholder";
  const bobAnim = bobIndex % 2 === 0 ? "card-bob" : "card-bob-alt";
  const bobDuration = 3 + (bobIndex % 3) * 0.5; // 3s, 3.5s, or 4s
  const bobDelay = bobIndex * 0.4;

  return (
    <div
      className={`flex flex-col items-center gap-1.5 flex-shrink-0 ${isNew ? "card-flip-in card-glow" : ""} ${isWaving ? "card-wave" : ""}`}
      style={{
        ...(isWaving ? { animationDelay: `${waveDelay}ms` } : {}),
        ...(shouldBob ? {
          animation: `${bobAnim} ${bobDuration}s ease-in-out ${bobDelay}s infinite`,
        } : {}),
      }}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden group"
        style={{
          height: `${h}dvh`,
          border: isActive
            ? "1px solid var(--color-accent)"
            : "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: isActive
            ? "0 0 12px 0 rgba(var(--color-accent-rgb, 230, 57, 70), 0.15)"
            : "inset 0 0 0 0.5px rgba(255, 255, 255, 0.04)",
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

        {/* Undo X button — appears on hover over newest card */}
        {isNewest && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
            aria-label="Undo"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1l8 8M9 1l-8 8" />
            </svg>
          </button>
        )}
      </div>
      {name && (
        <span
          className="text-xs uppercase tracking-[0.08em] text-center truncate max-w-[120px]"
          style={{ color: "var(--color-text)" }}
        >
          {name}
        </span>
      )}
    </div>
  );
}

function ChainConnector({ confirmed = true, swayIndex = 0 }: { confirmed?: boolean; swayIndex?: number }) {
  const duration = 3 + (swayIndex % 3) * 0.6;
  const delay = swayIndex * 0.3;

  return (
    <svg
      width="28"
      height="40"
      viewBox="0 0 28 40"
      className="flex-shrink-0 mx-0"
      style={{
        animation: `string-sway ${duration}s ease-in-out ${delay}s infinite`,
        transformOrigin: "center center",
      }}
    >
      <path
        d="M 0 20 C 8 8, 20 32, 28 20"
        stroke={confirmed ? "var(--color-accent)" : "var(--color-border)"}
        fill="none"
        strokeWidth="1"
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
