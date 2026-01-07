function MovieCard({ movie, onSelect, onToggleFavorite, isFavorite }) {
  const poster =
    movie.Poster !== "N/A"
      ? movie.Poster
      : `https://placehold.co/300x450/020617/ffffff?text=${encodeURIComponent(
          movie.Title
        )}`;

  return (
    <div className="movie-card">
      <img src={poster} onClick={() => onSelect(movie.imdbID)} />
      <h4>{movie.Title}</h4>
      <p>{movie.Year}</p>
      <button onClick={() => onToggleFavorite(movie)}>
        {isFavorite ? "⭐" : "☆"}
      </button>
    </div>
  );
}

export default MovieCard;
