// ── TMDB API key ──────────────────────────────────────────────────────────
// import.meta.env is Vite's compile-time env accessor.
// VITE_TMDB_KEY matches the variable in .env; the VITE_ prefix is required
// so Vite bundles it into the client — all other .env vars are stripped.
const API_KEY = import.meta.env.VITE_TMDB_KEY;

// ── Endpoints used by Row components ──────────────────────────────────────
// Paths are relative; Row.jsx prepends https://api.themoviedb.org/3
// and appends &api_key=... automatically.
// Keeping them here as named constants means one place to update if
// TMDB ever changes a URL.

const requests = {
  // ── Stage 3 required endpoints ──────────────────────────────────────────
  fetchTrending:      `/trending/movie/week?api_key=${API_KEY}&language=en-US`,
  fetchTopRated:      `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies:  `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchHorrorMovies:  `/discover/movie?api_key=${API_KEY}&with_genres=27`,

  // ── Additional endpoints (available for future rows) ────────────────────
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchComedyMovies:     `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchRomanceMovies:    `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries:    `/discover/movie?api_key=${API_KEY}&with_genres=99`,
};

export default requests;
