"use client";

import { ChainLink } from "@/lib/types";
import { getProfileUrl, getPosterUrl } from "@/lib/game-data";

interface ChainDisplayProps {
  chain: ChainLink[];
}

export function ChainDisplay({ chain }: ChainDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-1 w-full">
      {chain.map((link, i) => (
        <div key={`${link.type}-${link.id}-${i}`} className="flex flex-col items-center">
          {i > 0 && (
            <div
              className="w-px h-4"
              style={{ background: "var(--color-text-muted)" }}
            />
          )}
          {link.type === "actor" ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: "var(--color-surface)" }}>
              {link.profilePath ? (
                <img
                  src={getProfileUrl(link.profilePath, "w45")}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-white/10" />
              )}
              <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                {link.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(233, 69, 96, 0.15)" }}>
              {link.posterPath ? (
                <img
                  src={getPosterUrl(link.posterPath, "w92")}
                  alt=""
                  className="w-5 h-7 rounded object-cover"
                />
              ) : (
                <div className="w-5 h-7 rounded bg-white/10" />
              )}
              <span className="text-xs" style={{ color: "var(--color-accent-soft)" }}>
                {link.name}
                {link.mediaType === "tv" ? " (TV)" : ""}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
