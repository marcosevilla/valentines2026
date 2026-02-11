"use client";

import { useEffect, useRef } from "react";
import { MediaResult, PersonResult, SearchMode } from "@/lib/types";
import { getProfileUrl, getPosterUrl } from "@/lib/game-data";

interface SearchResultsProps {
  results: (MediaResult | PersonResult)[];
  mode: SearchMode;
  onSelect: (item: MediaResult | PersonResult) => void;
  onClose: () => void;
}

export function SearchResults({
  results,
  mode,
  onSelect,
  onClose,
}: SearchResultsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 w-full mt-1 rounded-lg overflow-hidden shadow-lg max-h-64 overflow-y-auto"
      style={{ background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      {results.map((item) => {
        if (mode === "media") {
          const media = item as MediaResult;
          return (
            <button
              key={`${media.mediaType}-${media.id}`}
              onClick={() => onSelect(media)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-colors"
            >
              {media.posterPath ? (
                <img
                  src={getPosterUrl(media.posterPath, "w92")}
                  alt=""
                  className="w-8 h-12 rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-12 rounded flex-shrink-0 bg-white/10" />
              )}
              <div className="min-w-0">
                <div className="text-sm truncate" style={{ color: "var(--color-text)" }}>
                  {media.title}
                </div>
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {media.mediaType === "tv" ? "TV" : "Film"}
                  {media.year ? `, ${media.year}` : ""}
                </div>
              </div>
            </button>
          );
        }

        const person = item as PersonResult;
        return (
          <button
            key={person.id}
            onClick={() => onSelect(person)}
            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-colors"
          >
            {person.profilePath ? (
              <img
                src={getProfileUrl(person.profilePath, "w45")}
                alt=""
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full flex-shrink-0 bg-white/10" />
            )}
            <div className="text-sm truncate" style={{ color: "var(--color-text)" }}>
              {person.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}
