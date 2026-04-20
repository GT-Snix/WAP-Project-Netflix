import Hero from './Hero';
import Row from './Row';
import './App.css';

// ── TMDB endpoints ────────────────────────────────────────────────────────
// All relative paths; Row.jsx appends the base URL + api_key from
// import.meta.env.VITE_TMDB_KEY at fetch time.
// VITE_TMDB_KEY uses the VITE_ prefix so Vite injects it into the
// client bundle — variables without this prefix are stripped for security.

const REQUESTS = {
  // /trending/movie/week — top movies across the whole week on TMDB
  trending: '/trending/movie/week',

  // /movie/top_rated — movies with the highest average vote score
  topRated: '/movie/top_rated',

  // /discover/movie?with_genres=28 — discover endpoint filtered by Action (id 28)
  action: '/discover/movie?with_genres=28',

  // /discover/movie?with_genres=27 — discover endpoint filtered by Horror (id 27)
  horror: '/discover/movie?with_genres=27',
};

function App() {
  return (
    <div className="app">

      {/* ── Hero banner (Stage 2) — randomly picks a trending movie ── */}
      <Hero />

      {/* ── Movie rows (Stage 3) ──────────────────────────────────────
          Each Row accepts:
            title    → rendered as the section heading
            fetchUrl → relative TMDB path; Row builds the full URL internally

          map() note (applies to each Row internally):
          map returns a new array of JSX elements — key prop helps React
          identify which items changed, were added, or removed between
          renders so it only updates the affected DOM nodes.
      ─────────────────────────────────────────────────────────────── */}
      <Row title="Trending Now"  fetchUrl={REQUESTS.trending} />
      <Row title="Top Rated"     fetchUrl={REQUESTS.topRated} />
      <Row title="Action"        fetchUrl={REQUESTS.action}   />
      <Row title="Horror"        fetchUrl={REQUESTS.horror}   />

    </div>
  );
}

export default App;
