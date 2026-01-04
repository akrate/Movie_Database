import { getPoster } from "../lib/omdb";

export default function MovieCard({ movie, isFavorite, onToggleFavorite, onSelect }) {
  return (
    <button
      onClick={() => onSelect(movie.imdbID)}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-left transition hover:border-slate-600"
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          src={getPoster(movie)}
          alt={`${movie.Title} poster`}
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <button
        className={
          "absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-lg transition hover:bg-black/80 " +
          (isFavorite ? "text-yellow-300" : "text-slate-300")
        }
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(movie);
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "⭐" : "☆"}
      </button>

      <div className="p-3">
        <div className="line-clamp-1 text-sm font-semibold text-slate-100">{movie.Title}</div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="text-xs text-slate-400">{movie.Year}</div>
          {movie.imdbRating ? (
            <div className="text-xs text-slate-300">IMDb {movie.imdbRating}</div>
          ) : null}
        </div>
        {movie.Genre ? (
          <div className="mt-2 line-clamp-1 text-xs text-slate-500">{movie.Genre}</div>
        ) : null}
      </div>
    </button>
  );
}
