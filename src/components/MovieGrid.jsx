import MovieCard from "./MovieCard";

export default function MovieGrid({ movies, favoritesSet, onToggleFavorite, onSelect, loading }) {
  if (loading) {
    return <div className="text-sm text-slate-400">Loading movies...</div>;
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
        No movies to show.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {movies.map((m) => (
        <MovieCard
          key={m.imdbID}
          movie={m}
          isFavorite={favoritesSet.has(m.imdbID)}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
