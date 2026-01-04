import { useEffect, useMemo, useRef, useState } from "react";
import Footer from "./components/Footer";
import GenreSelect from "./components/GenreSelect";
import MovieDetails from "./components/MovieDetails";
import MovieGrid from "./components/MovieGrid";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import { useDebounce } from "./hooks/useDebounce";
import { getRandomTerm, omdbFetch } from "./lib/omdb";

const FAVORITES_KEY = "favorites_movies_v1";

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 600);

  const [genre, setGenre] = useState("all");
  const [mode, setMode] = useState("home"); // home | search | favorites

  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [favorites, setFavorites] = useState(() => loadFavorites());
  const favoritesSet = useMemo(() => new Set(favorites.map((m) => m.imdbID)), [favorites]);

  // Cache details to avoid refetching for genre/rating
  const detailsCacheRef = useRef(new Map());

  async function enrichBatch(baseMovies, { signal } = {}) {
    // Fetch details (Genre, imdbRating) for each movie in parallel with a small cap.
    const limit = 6;
    const results = [];

    for (let i = 0; i < baseMovies.length; i += limit) {
      const chunk = baseMovies.slice(i, i + limit);
      const chunkResults = await Promise.all(
        chunk.map(async (m) => {
          const cached = detailsCacheRef.current.get(m.imdbID);
          if (cached) return { ...m, ...cached };

          try {
            const d = await omdbFetch({ i: m.imdbID }, { signal });
            const pick = {
              Genre: d.Genre,
              imdbRating: d.imdbRating,
              Type: d.Type || m.Type,
            };
            detailsCacheRef.current.set(m.imdbID, pick);
            return { ...m, ...pick };
          } catch {
            return m;
          }
        })
      );
      results.push(...chunkResults);
    }

    return results;
  }

  async function loadRandomHome() {
    const ctrl = new AbortController();
    setLoading(true);
    setMessage("Loading movies...");
    setSelectedId("");
    setGenre("all");
    setMode("home");
    setPage(1);
    setTotalResults(0);

    try {
      const term = getRandomTerm();
      const randomPage = Math.floor(Math.random() * 5) + 1;
      const data = await omdbFetch({ s: term, page: randomPage }, { signal: ctrl.signal });

      const base = data.Search || [];
      const enriched = await enrichBatch(base, { signal: ctrl.signal });
      setMovies(enriched);
      setMessage("");
    } catch (e) {
      setMovies([]);
      setMessage(e?.message || "Network error");
    } finally {
      setLoading(false);
    }

    return () => ctrl.abort();
  }

  async function runSearch(nextPage = 1, explicitQuery) {
    const q = (explicitQuery ?? query).trim();
    if (q.length < 3) {
      setMessage("Type at least 3 letters to search.");
      return;
    }

    const ctrl = new AbortController();
    setLoading(true);
    setMessage("Searching...");
    setSelectedId("");
    setMode("search");
    setPage(nextPage);

    try {
      const data = await omdbFetch({ s: q, page: nextPage }, { signal: ctrl.signal });
      const base = data.Search || [];
      const enriched = await enrichBatch(base, { signal: ctrl.signal });
      setMovies(enriched);
      setTotalResults(Number.parseInt(data.totalResults || "0", 10) || 0);
      setMessage("");
    } catch (e) {
      setMovies([]);
      setTotalResults(0);
      setMessage(e?.message || "Network error");
    } finally {
      setLoading(false);
    }

    return () => ctrl.abort();
  }

  // Auto-search when user types (debounced)
  useEffect(() => {
    if (mode === "favorites") return;
    const q = debouncedQuery.trim();
    if (q.length >= 3) {
      runSearch(1, q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // Initial home load
  useEffect(() => {
    loadRandomHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleFavorite(movie) {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.imdbID === movie.imdbID);
      const next = exists ? prev.filter((m) => m.imdbID !== movie.imdbID) : [movie, ...prev];
      saveFavorites(next);
      return next;
    });
  }

  const filteredMovies = useMemo(() => {
    if (!movies) return [];
    if (genre === "all") return movies;
    return movies.filter((m) => (m.Genre || "").split(",").map((g) => g.trim()).includes(genre));
  }, [movies, genre]);

  const title = useMemo(() => {
    if (mode === "favorites") return "⭐ Your Favorites";
    if (mode === "search") return `Search Results for "${query.trim()}"`;
    return "🎬 Discover Movies";
  }, [mode, query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
              <h1 className="text-2xl font-bold">🎬 Movie Database</h1>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                <button
                  className="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-950"
                  onClick={() => loadRandomHome()}
                  disabled={loading}
                >
                  Home
                </button>
                <button
                  className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-100"
                  onClick={() => {
                    setMode("favorites");
                    setSelectedId("");
                    setGenre("all");
                    setMovies(favorites);
                    setMessage("");
                    setTotalResults(0);
                    setPage(1);
                  }}
                >
                  Favorites
                </button>
                <button
                  className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-100"
                  onClick={() => loadRandomHome()}
                  disabled={loading}
                >
                  Random
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:max-w-xl">
                <SearchBar
                  value={query}
                  onChange={(v) => {
                    setQuery(v);
                    if (v.trim().length < 3 && mode === "search") {
                      setMessage("Type at least 3 letters to search.");
                      setMovies([]);
                      setTotalResults(0);
                    }
                  }}
                  onSearch={() => runSearch(1)}
                  loading={loading}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <GenreSelect value={genre} onChange={setGenre} />
                <span className="text-xs text-slate-400">(Genre uses OMDb details)</span>
              </div>
            </div>

            {message ? <p className="text-sm text-red-300">{message}</p> : null}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-200">{title}</h2>

          <MovieGrid
            movies={filteredMovies}
            favoritesSet={favoritesSet}
            onToggleFavorite={toggleFavorite}
            onSelect={(id) => setSelectedId(id)}
            loading={loading}
          />

          {mode === "search" && totalResults > 0 ? (
            <Pagination
              page={page}
              totalResults={totalResults}
              disabled={loading}
              onPrev={() => runSearch(page - 1)}
              onNext={() => runSearch(page + 1)}
            />
          ) : null}
        </section>

        <MovieDetails imdbID={selectedId} onClose={() => setSelectedId("")} />
      </main>

      <Footer />
    </div>
  );
}
