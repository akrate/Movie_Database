const BASE = "https://www.omdbapi.com/";

export const DEFAULT_RANDOM_TERMS = [
  "love",
  "war",
  "man",
  "life",
  "dark",
  "night",
  "day",
  "world",
  "girl",
  "boy",
  "dream",
  "time",
  "king",
  "lost",
  "hero",
  "road",
  "home",
];

export function getApiKey() {
  return import.meta.env.VITE_OMDB_API_KEY || "1c716f1e";
}

export function getRandomTerm() {
  const terms = DEFAULT_RANDOM_TERMS;
  return terms[Math.floor(Math.random() * terms.length)];
}

export function buildUrl(params) {
  const url = new URL(BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  return url.toString();
}

export async function omdbFetch(params, { signal } = {}) {
  const url = buildUrl({ apikey: getApiKey(), ...params });
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Network error");
  const data = await res.json();
  if (data?.Response === "False") {
    throw new Error(data?.Error || "Request failed");
  }
  return data;
}

export function generatePoster({ Title, Year }) {
  const text = encodeURIComponent(`${Title} (${Year})`);
  return `https://placehold.co/300x450/020617/ffffff?text=${text}`;
}

export function getPoster(movie) {
  if (movie?.Poster && movie.Poster !== "N/A" && movie.Poster.startsWith("https://")) {
    return movie.Poster;
  }
  return generatePoster(movie || { Title: "No Poster", Year: "" });
}
