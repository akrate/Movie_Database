import { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import { searchMovies, getMovieDetails } from "./services/omdb";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [loading, setLoading] = useState(false);

  function randomTerm() {
    const t = ["love","war","man","life","night","hero","world","king"];
    return t[Math.floor(Math.random() * t.length)];
  }

  async function loadRandom() {
    setLoading(true);
    setSelectedMovie(null);
    const data = await searchMovies(randomTerm());
    setMovies(data.Search || []);
    setLoading(false);
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const data = await searchMovies(query);
    setMovies(data.Search || []);
    setLoading(false);
  }

  async function selectMovie(id) {
    setLoading(true);
    const data = await getMovieDetails(id);
    setSelectedMovie(data);
    setLoading(false);
  }

  function toggleFavorite(movie) {
    const exists = favorites.some(f => f.imdbID === movie.imdbID);
    const updated = exists
      ? favorites.filter(f => f.imdbID !== movie.imdbID)
      : [...favorites, movie];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

  function showFavorites() {
    setMovies(favorites);
    setSelectedMovie(null);
  }

  useEffect(() => {
    loadRandom();
  }, []);

  return (
    <div>
      <Header onHome={loadRandom} onFavorites={showFavorites} />

      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={handleSearch}
      />

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      <div className="main">
        <MovieList
          movies={movies}
          onSelect={selectMovie}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />

        <div className="details">
          <MovieDetails movie={selectedMovie} />
        </div>
      </div>
    </div>
  );
}

export default App;
