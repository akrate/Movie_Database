const API_KEY = "1c716f1e";

// ===== DOM =====
const moviesContainer = document.getElementById("movies");
const detailsContainer = document.getElementById("details");
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const homeBtn = document.getElementById("homeBtn");
const favBtn = document.getElementById("favBtn");
const message = document.getElementById("message");
const resultsTitle = document.getElementById("resultsTitle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// ===== STATE =====
let allMovies = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let searchTimeout = null;
let currentPage = 1;
let totalResults = 0;
let currentQuery = "";

const currentYear = new Date().getFullYear();

// ===== HELPERS =====
function showMessage(text) {
  message.textContent = text;
}

function togglePagination(show) {
  prevBtn.style.display = show ? "inline-block" : "none";
  nextBtn.style.display = show ? "inline-block" : "none";
}

// 🔥 Generate poster (STABLE SERVICE)
function generatePoster(movie) {
  const text = encodeURIComponent(`${movie.Title} (${movie.Year})`);
  return `https://placehold.co/300x450/020617/ffffff?text=${text}`;
}

// 🔥 Always returns a valid image
function getPoster(movie) {
  if (
    movie.Poster &&
    movie.Poster !== "N/A" &&
    movie.Poster.startsWith("https://")
  ) {
    return movie.Poster;
  }
  return generatePoster(movie);
}

// ===== PAGINATION =====
prevBtn.addEventListener("click", () => {
  if (currentQuery && currentPage > 1) {
    searchMovies(currentQuery, currentPage - 1);
  }
});

nextBtn.addEventListener("click", () => {
  const maxPage = Math.ceil(totalResults / 10);
  if (currentQuery && currentPage < maxPage) {
    searchMovies(currentQuery, currentPage + 1);
  }
});

// ===== FETCH BEST MOVIES =====
async function fetchBestMoviesThisYear() {
  try {
    togglePagination(false);
    showMessage("Loading best movies...");
    resultsTitle.textContent = `Best Movies of ${currentYear}`;
    searchInput.value = "";
    genreSelect.value = "all";
    detailsContainer.innerHTML = "<p>Select a movie to see details.</p>";

    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=movie&y=${currentYear}`
    );
    const data = await res.json();

    if (data.Response === "False") {
      showMessage("No movies found.");
      return;
    }

    allMovies = data.Search;
    renderMovies(allMovies);
    showMessage("");
  } catch {
    showMessage("Network error.");
  }
}

// ===== RENDER MOVIES =====
function renderMovies(list) {
  moviesContainer.innerHTML = "";

  list.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const isFav = favorites.some(
      (f) => f.imdbID === movie.imdbID
    );

    card.innerHTML = `
      <img src="${getPoster(movie)}"
           onerror="this.src='https://placehold.co/300x450/020617/ffffff?text=No+Poster'">

      <button class="fav-btn ${isFav ? "active" : ""}">
        ${isFav ? "⭐" : "☆"}
      </button>

      <div class="info">
        <h4>${movie.Title}</h4>
        <p>${movie.Year}</p>
      </div>
    `;

    card.onclick = () => fetchMovieDetails(movie.imdbID);

    card.querySelector(".fav-btn").onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(movie);
    };

    moviesContainer.appendChild(card);
  });
}

// ===== MOVIE DETAILS =====
async function fetchMovieDetails(id) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
    );
    const m = await res.json();

    detailsContainer.innerHTML = `
      <img src="${getPoster(m)}"
           onerror="this.src='https://placehold.co/300x450/020617/ffffff?text=No+Poster'">

      <h3>${m.Title} (${m.Year})</h3>
      <p><strong>Genre:</strong> ${m.Genre}</p>
      <p><strong>Actors:</strong> ${m.Actors}</p>
      <p><strong>Rating:</strong> ${m.imdbRating}</p>
      <p>${m.Plot}</p>
    `;
  } catch {
    detailsContainer.innerHTML =
      "<p>Network error loading details.</p>";
  }
}

// ===== SEARCH =====
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  const query = searchInput.value.trim();
  if (query.length < 3) return;

  searchTimeout = setTimeout(() => {
    searchMovies(query);
  }, 600);
});

async function searchMovies(query, page = 1) {
  try {
    togglePagination(true);
    showMessage("Searching...");
    currentQuery = query;
    currentPage = page;

    resultsTitle.textContent = `Search Results for "${query}"`;

    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`
    );
    const data = await res.json();

    if (data.Response === "False") {
      renderMovies([]);
      showMessage("No movies found.");
      return;
    }

    totalResults = parseInt(data.totalResults);
    allMovies = data.Search;
    renderMovies(allMovies);

    showMessage(
      `Page ${currentPage} of ${Math.ceil(totalResults / 10)}`
    );
  } catch {
    showMessage("Network error.");
  }
}

// ===== GENRE FILTER =====
genreSelect.addEventListener("change", () => {
  const genre = genreSelect.value;
  if (genre === "all") renderMovies(allMovies);
  else
    renderMovies(
      allMovies.filter((m) =>
        m.Genre?.includes(genre)
      )
    );
});

// ===== FAVORITES =====
function toggleFavorite(movie) {
  const index = favorites.findIndex(
    (f) => f.imdbID === movie.imdbID
  );

  if (index === -1) favorites.push(movie);
  else favorites.splice(index, 1);

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderMovies(allMovies);
}

favBtn.addEventListener("click", () => {
  togglePagination(false);
  resultsTitle.textContent = "⭐ Your Favorites";
  renderMovies(favorites);
  detailsContainer.innerHTML =
    "<p>Select a movie to see details.</p>";
  showMessage("");
});

// ===== HOME =====
homeBtn.addEventListener("click", fetchBestMoviesThisYear);

// ===== INIT =====
fetchBestMoviesThisYear();
