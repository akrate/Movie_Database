const API_KEY = "1c716f1e";

const moviesContainer = document.getElementById("movies");
const detailsContainer = document.getElementById("details");
const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const resultsTitle = document.getElementById("resultsTitle");

let currentMovies = [];

// Fetch default movies on page load
async function fetchTrendingMovies() {
  try {
    message.textContent = "Loading movies...";
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=batman`
    );
    const data = await response.json();

    if (data.Response === "False") {
      message.textContent = "No movies found.";
      return;
    }

    currentMovies = data.Search;
    renderMovies(currentMovies);
    message.textContent = "";
  } catch (error) {
    message.textContent = "Network error. Please try again.";
  }
}

// Render movie cards
function renderMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="${
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/300x450"
      }" />
      <div class="info">
        <h4>${movie.Title}</h4>
        <p>${movie.Year}</p>
      </div>
    `;

    card.addEventListener("click", () => fetchMovieDetails(movie.imdbID));
    moviesContainer.appendChild(card);
  });
}

// Fetch movie details
async function fetchMovieDetails(id) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
    );
    const movie = await response.json();

    detailsContainer.innerHTML = `
      <img src="${
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/300x450"
      }" />
      <h3>${movie.Title} (${movie.Year})</h3>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Ratings:</strong> ${
        movie.imdbRating || "N/A"
      }</p>
      <p>${movie.Plot}</p>
    `;
  } catch (error) {
    detailsContainer.innerHTML =
      "<p>Error loading movie details.</p>";
  }
}

// Filter movies locally
input.addEventListener("input", () => {
  const query = input.value.toLowerCase();
  const filtered = currentMovies.filter(movie =>
    movie.Title.toLowerCase().includes(query)
  );

  renderMovies(filtered);
});

// Search online using API
searchBtn.addEventListener("click", async () => {
  const query = input.value.trim();
  if (!query) return;

  try {
    resultsTitle.textContent = `Search Results for "${query}"`;
    message.textContent = "Searching...";

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      message.textContent = "No movies found online.";
      moviesContainer.innerHTML = "";
      return;
    }

    currentMovies = data.Search;
    renderMovies(currentMovies);
    message.textContent = "";
  } catch (error) {
    message.textContent = "Network error. Please try again.";
  }
});

// Initial load
fetchTrendingMovies();
