const API_KEY = "1c716f1e";

export async function searchMovies(query) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
  );
  return res.json();
}

export async function getMovieDetails(id) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
  );
  return res.json();
}
