import MovieCard from "./MovieCard";

function MovieList({ movies, onSelect, favorites, onToggleFavorite }) {
  if (!movies.length) return <p>No movies found.</p>;

  return (
    <div className="movie-list">
      {movies.map((m) => (
        <MovieCard
          key={m.imdbID}
          movie={m}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.some((f) => f.imdbID === m.imdbID)}
        />
      ))}
    </div>
  );
}

export default MovieList;
