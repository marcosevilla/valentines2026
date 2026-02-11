import { MediaResult, PersonResult } from "./types";

export async function searchMedia(query: string): Promise<MediaResult[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `/api/tmdb/search?query=${encodeURIComponent(query)}&type=media`,
  );
  const data = await res.json();
  return data.results || [];
}

export async function searchPeople(query: string): Promise<PersonResult[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `/api/tmdb/search?query=${encodeURIComponent(query)}&type=person`,
  );
  const data = await res.json();
  return data.results || [];
}

export async function validateConnection(
  actorId: number,
  mediaId: number,
  mediaType: "movie" | "tv",
): Promise<boolean> {
  const res = await fetch(
    `/api/tmdb/validate?actorId=${actorId}&mediaId=${mediaId}&mediaType=${mediaType}`,
  );
  const data = await res.json();
  return data.valid;
}
