import { useEffect, useState } from "react";
import { getPoster, omdbFetch } from "../lib/omdb";

export default function MovieDetails({ imdbID, onClose }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    if (!imdbID) return;

    (async () => {
      try {
        setLoading(true);
        setError("");
        setMovie(null);

        const data = await omdbFetch({ i: imdbID, plot: "full" });
        if (alive) setMovie(data);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load details");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [imdbID]);

  return (
    <aside className="sticky top-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-200">Movie Details</h3>
        <button
          className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {!imdbID ? (
        <p className="mt-4 text-sm text-slate-400">Select a movie to see details.</p>
      ) : loading ? (
        <p className="mt-4 text-sm text-slate-400">Loading details...</p>
      ) : error ? (
        <p className="mt-4 text-sm text-red-300">{error}</p>
      ) : movie ? (
        <div className="mt-4">
          <img
            src={getPoster(movie)}
            alt={`${movie.Title} poster`}
            className="w-full rounded-2xl border border-slate-800"
          />

          <h4 className="mt-3 text-lg font-semibold">{movie.Title}</h4>
          <p className="mt-1 text-sm text-slate-400">
            {movie.Year} • {movie.Runtime} • {movie.Rated}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {(movie.Genre || "")
              .split(",")
              .map((g) => g.trim())
              .filter(Boolean)
              .map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-200"
                >
                  {g}
                </span>
              ))}
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>
              <span className="font-semibold text-slate-200">Actors:</span> {movie.Actors}
            </p>
            <p>
              <span className="font-semibold text-slate-200">IMDb:</span> {movie.imdbRating}
            </p>
            {movie.Ratings?.length ? (
              <div>
                <div className="font-semibold text-slate-200">Ratings:</div>
                <ul className="mt-2 space-y-1">
                  {movie.Ratings.map((r) => (
                    <li key={r.Source} className="flex items-center justify-between gap-3">
                      <span className="text-slate-400">{r.Source}</span>
                      <span className="text-slate-200">{r.Value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <div className="font-semibold text-slate-200">Plot:</div>
              <p className="mt-2 leading-6 text-slate-300">{movie.Plot}</p>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
