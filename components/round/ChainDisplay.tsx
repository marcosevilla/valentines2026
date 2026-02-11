"use client";

import { useRef, useEffect, useState } from "react";
import { ChainLink, SearchMode } from "@/lib/types";
import { ChainCard, ChainConnector } from "./ChainCard";

interface ChainDisplayProps {
  chain: ChainLink[];
  currentSearchMode: SearchMode;
  targetActress: { name: string; id: number; profilePath: string };
  isComplete: boolean;
}

export function ChainDisplay({
  chain,
  currentSearchMode,
  targetActress,
  isComplete,
}: ChainDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLength = useRef(chain.length);
  const [newestIndex, setNewestIndex] = useState(-1);
  const [isWaving, setIsWaving] = useState(false);

  // Dynamic card heights — shrink as chain grows
  const chainLength = chain.length;
  const bookendH = Math.max(22, 50 - (chainLength - 1) * 5);
  const intermediateH = Math.max(16, bookendH * 0.7);

  // Detect new card additions and trigger flip animation
  useEffect(() => {
    if (chain.length > prevLength.current && chain.length > 1) {
      setNewestIndex(chain.length - 1);
      const timer = setTimeout(() => setNewestIndex(-1), 500);
      prevLength.current = chain.length;
      return () => clearTimeout(timer);
    }
    prevLength.current = chain.length;
  }, [chain.length]);

  // Auto-scroll to show newest cards
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [chain.length]);

  // Trigger wave animation on completion
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setIsWaving(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const displayChain = isComplete ? chain.slice(0, -1) : chain;

  return (
    <div className="flex items-center w-full">
      {/* Scrollable chain area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto scrollbar-hide"
      >
        <div className="flex items-center px-4 py-4 min-w-min">
          {displayChain.map((link, i) => (
            <div
              key={`${link.type}-${link.id}-${i}`}
              className="flex items-center"
            >
              {i > 0 && <ChainConnector />}
              <ChainCard
                variant={i === 0 ? "start" : link.type === "actor" ? "actor" : "media"}
                name={link.name}
                imagePath={link.type === "actor" ? link.profilePath : link.posterPath}
                mediaType={link.mediaType}
                isNew={i === newestIndex}
                isWaving={isWaving}
                waveDelay={isComplete ? (displayChain.length - 1 - i) * 80 : 0}
                heightDvh={i === 0 ? bookendH : intermediateH}
              />
            </div>
          ))}

          {/* Placeholder for next pick */}
          {!isComplete && (
            <div className="flex items-center">
              <ChainConnector confirmed={false} />
              <ChainCard
                variant="placeholder"
                searchMode={currentSearchMode}
                heightDvh={intermediateH}
              />
            </div>
          )}
        </div>
      </div>

      {/* Pinned target actress — no connector until complete */}
      <div className="flex-shrink-0 flex items-center pr-4">
        {isComplete && <ChainConnector confirmed />}
        <ChainCard
          variant="end"
          name={targetActress.name}
          imagePath={targetActress.profilePath}
          isActive={isComplete}
          isWaving={isWaving}
          waveDelay={0}
          heightDvh={bookendH}
        />
      </div>
    </div>
  );
}
