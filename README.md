# 🎬 Movie Database (React + Vite)

A Movie Database frontend built with **React** and the **OMDb API**.

## Features

- **Random Home**: Home page shows a random set of movies (discovery mode).
- **Search** (debounced + manual): type a query (min 3 letters) to search.
- **Pagination** for search results.
- **Movie Details** view (plot, cast, ratings, genres).
- **Favorites** (stored in localStorage).
- **Always-working posters**: if a movie poster is missing/blocked, the app generates a clean placeholder poster.

## Tech Stack

- React (Vite)
- Tailwind CSS
- OMDb API

## Setup

1. Install dependencies

```bash
npm install
```

2. (Optional) Use your own OMDb API key

Create a `.env` file in the project root:

```bash
VITE_OMDB_API_KEY=YOUR_KEY_HERE
```

3. Run

```bash
npm run dev
```

## Deployment

Works great on Netlify / Vercel / GitHub Pages (static build):

```bash
npm run build
```

---

Built by Oussama
