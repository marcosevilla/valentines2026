"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchMedia, searchPeople } from "@/lib/tmdb";
import { MediaResult, PersonResult, SearchMode } from "@/lib/types";
import { SearchResults } from "./SearchResults";

interface SearchInputProps {
  mode: SearchMode;
  placeholder: string;
  onSelectMedia: (media: MediaResult) => void;
  onSelectPerson: (person: PersonResult) => void;
  disabled?: boolean;
  excludeActorIds?: number[];
}

export function SearchInput({
  mode,
  placeholder,
  onSelectMedia,
  onSelectPerson,
  disabled,
  excludeActorIds = [],
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(MediaResult | PersonResult)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const doSearch = async () => {
      const data =
        mode === "media"
          ? await searchMedia(debouncedQuery)
          : await searchPeople(debouncedQuery);

      if (cancelled) return;

      const filtered =
        mode === "person"
          ? (data as PersonResult[]).filter(
              (p) => !excludeActorIds.includes(p.id),
            )
          : data;

      setResults(filtered);
      setIsOpen(filtered.length > 0);
      setIsLoading(false);
    };

    doSearch();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, mode, excludeActorIds]);

  const handleSelect = (item: MediaResult | PersonResult) => {
    if (mode === "media") {
      onSelectMedia(item as MediaResult);
    } else {
      onSelectPerson(item as PersonResult);
    }
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        autoCapitalize="words"
        className="w-full py-3 text-base outline-none transition-all placeholder:text-left"
        style={{
          background: "transparent",
          color: "var(--color-text)",
          borderBottom: "2px solid var(--color-border)",
        }}
        onFocusCapture={(e) => {
          e.currentTarget.style.borderBottomWidth = "3px";
          e.currentTarget.style.borderBottomColor = "var(--color-accent)";
          results.length > 0 && setIsOpen(true);
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderBottomWidth = "2px";
          e.currentTarget.style.borderBottomColor = "var(--color-border)";
        }}
      />
      {isLoading && (
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-[1.5px] rounded-full animate-spin"
          style={{
            borderColor: "var(--color-border)",
            borderTopColor: "var(--color-accent)",
          }}
        />
      )}
      {isOpen && results.length > 0 && (
        <SearchResults
          results={results}
          mode={mode}
          onSelect={handleSelect}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
