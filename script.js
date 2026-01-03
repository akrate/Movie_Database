const API_KEY = "1c716f1e";

const moviesContainer = document.getElementById("movies");
const detailsContainer = document.getElementById("details");
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const homeBtn = document.getElementById("homeBtn");
const message = document.getElementById("message");
const resultsTitle = document.getElementById("resultsTitle");
const favBtn = document.getElementById("favBtn");

let allMovies = [];
let searchTimeout = null;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ===== Helpers =====
const currentYear = new Date().getFullYear();

function showMessage(text) {
  message.textContent = text;
}

// ===== Fetch Best Movies of This Year =====
async function fetchBestMoviesThisYear() {
  try {
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
      movies.map(async m => {
        const d = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}`
        ).then(r => r.json());

        return {
          ...m,
          rating: parseFloat(d.imdbRating) || 0,
          genres: d.Genre ? d.Genre.split(", ").map(g => g.trim()) : []
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

  list.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const isFav = favorites.some(f => f.imdbID === movie.imdbID);

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}">

      <button class="fav-btn ${isFav ? "active" : ""}">
        ${isFav ? "⭐" : "☆"}
      </button>

      <div class="info">
        <h4>${movie.Title}</h4>
        <p>${movie.Year}</p>
      </div>
    `;

    // click على card = details
    card.onclick = () => fetchMovieDetails(movie.imdbID);

    // click على star = favorite
    card.querySelector(".fav-btn").onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(movie);
    };

    moviesContainer.appendChild(card);
  });
}


// ===== Fetch Movie Details =====
async function fetchMovieDetails(id) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
  );
  const m = await res.json();

  detailsContainer.innerHTML = `
    <img src="${m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450"}">
    <h3>${m.Title} (${m.Year})</h3>
    <p><strong>Genre:</strong> ${m.Genre}</p>
    <p><strong>Actors:</strong> ${m.Actors}</p>
    <p><strong>Rating:</strong> ${m.imdbRating}</p>
    <p>${m.Plot}</p>
  `;
}

// ===== Debounced Search =====
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);

  const query = searchInput.value.trim();
  if (query.length < 3) return;

  searchTimeout = setTimeout(() => {
    searchMovies(query);
  }, 600);
});

// ===== Search Movies =====
async function searchMovies(query) {
  try {
    showMessage("Searching...");
    resultsTitle.textContent = `Search Results for "${query}"`;

    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );
    const data = await res.json();

    if (data.Response === "False") {
      renderMovies([]);
      showMessage("No movies found.");
      return;
    }

    const movies = data.Search.slice(0, 10);

    allMovies = await Promise.all(
      movies.map(async m => {
        const d = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}`
        ).then(r => r.json());

        return {
          ...m,
          genres: d.Genre ? d.Genre.split(", ").map(g => g.trim()) : []
        };
      })
    );

    renderMovies(allMovies);
    showMessage("");
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

  const filtered = allMovies.filter(m =>
    m.genres.includes(genre)
  );

  renderMovies(filtered);
});

function toggleFavorite(movie) {
  const index = favorites.findIndex(f => f.imdbID === movie.imdbID);

  if (index === -1) {
    favorites.push(movie);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderMovies(allMovies);
}


favBtn.addEventListener("click", () => {
  resultsTitle.textContent = "⭐ Your Favorites";
  renderMovies(favorites);
  detailsContainer.innerHTML = "<p>Select a movie to see details.</p>";
  showMessage("");
});

// ===== Home Button =====
homeBtn.addEventListener("click", fetchBestMoviesThisYear);

// Initial Load
fetchBestMoviesThisYear();
