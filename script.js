const API_KEY = "1c716f1e";
const PLACEHOLDER =
  "https://via.placeholder.com/300x450?text=No+Poster";

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

// ===== State =====
let allMovies = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let searchTimeout = null;
let currentPage = 1;
let totalResults = 0;
let currentQuery = "";

const currentYear = new Date().getFullYear();

// ===== Helpers =====
function showMessage(text) {
  message.textContent = text;
}

function togglePagination(show) {
  prevBtn.style.display = show ? "inline-block" : "none";
  nextBtn.style.display = show ? "inline-block" : "none";
}

function safePoster(url) {
  if (!url || url === "N/A") return PLACEHOLDER;
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
}

// ===== Pagination =====
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

// ===== Fetch Best Movies =====
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

    const movies = data.Search.slice(0, 8);

    allMovies = await Promise.all(
      movies.map(async (m) => {
        const d = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}`
        ).then((r) => r.json());

        return {
          ...m,
          rating: parseFloat(d.imdbRating) || 0,
          genres: d.Genre ? d.Genre.split(", ").map((g) => g.trim()) : [],
        };
      })
    );

    allMovies.sort((a, b) => b.rating - a.rating);
    renderMovies(allMovies);
    showMessage("");
  } catch {
    showMessage("Network error.");
  }
}

// ===== Render Movies =====
function renderMovies(list) {
  moviesContainer.innerHTML = "";

  list.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const isFav = favorites.some((f) => f.imdbID === movie.imdbID);

    card.innerHTML = `
      <img 
        src="${safePoster(movie.Poster)}"
        onerror="this.onerror=null;this.src='${PLACEHOLDER}'"
      >

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

// ===== Movie Details =====
async function fetchMovieDetails(id) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
    );
    const m = await res.json();

    if (m.Response === "False") {
      detailsContainer.innerHTML =
        "<p>Failed to load movie details.</p>";
      return;
    }

    detailsContainer.innerHTML = `
      <img 
        src="${safePoster(m.Poster)}"
        onerror="this.onerror=null;this.src='${PLACEHOLDER}'"
      >
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

// ===== Search =====
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

    allMovies = await Promise.all(
      data.Search.map(async (m) => {
        const d = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}`
        ).then((r) => r.json());

        return {
          ...m,
          genres: d.Genre ? d.Genre.split(", ").map((g) => g.trim()) : [],
        };
      })
    );

    renderMovies(allMovies);
    showMessage(
      `Page ${currentPage} of ${Math.ceil(totalResults / 10)}`
    );
  } catch {
    showMessage("Network error.");
  }
}

// ===== Genre Filter =====
genreSelect.addEventListener("change", () => {
  const genre = genreSelect.value;

  if (genre === "all") {
    renderMovies(allMovies);
    return;
  }

  renderMovies(allMovies.filter((m) => m.genres.includes(genre)));
});

// ===== Favorites =====
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

// ===== Home =====
homeBtn.addEventListener("click", fetchBestMoviesThisYear);

// ===== Init =====
fetchBestMoviesThisYear();
