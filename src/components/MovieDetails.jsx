function MovieDetails({ movie }) {
  if (!movie) return <p>Select a movie to see details.</p>;

  const poster =
    movie.Poster !== "N/A"
      ? movie.Poster
      : `https://placehold.co/300x450/020617/ffffff?text=${encodeURIComponent(
          movie.Title
        )}`;

  return (
    <div>
      <img src={poster} />
      <h2>{movie.Title}</h2>
      <p><b>Genre:</b> {movie.Genre}</p>
      <p><b>Actors:</b> {movie.Actors}</p>
      <p><b>Rating:</b> {movie.imdbRating}</p>
      <p>{movie.Plot}</p>
    </div>
  );
}

export default MovieDetails;
