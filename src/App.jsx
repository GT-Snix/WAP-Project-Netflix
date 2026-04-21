import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import Row from './Row';
import Search from './Search';
import MovieModal from './MovieModal';
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
  // ── LIFTING STATE UP ────────────────────────────────────────────────────
  // selectedMovie lives here in App (the common ancestor) so both the
  // Home rows and the Search page can open the same MovieModal.
  // When a MovieCard is clicked, the child calls onSelect(movie) which
  // propagates up through Row → App via the onMovieSelect callback,
  // updating this state. This is "lifting state up" — the child doesn't
  // own the state, it tells the parent what happened, and the parent
  // decides what to do (render the modal).
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="app">
      {/* ── Navbar (Stage 4) — fixed top bar with Home + Search links ── */}
      <Navbar />

      <Routes>
        {/* ── Home route: Hero banner + movie rows ────────────────────── */}
        <Route
          path="/"
          element={
            <>
              {/* Hero banner (Stage 2) — shows the #1 trending movie */}
              <Hero />

              {/* ── Movie rows (Stage 3) ─────────────────────────────────
                  Each Row accepts:
                    title         → rendered as the section heading
                    fetchUrl      → relative TMDB path; Row builds the
                                    full URL internally
                    onMovieSelect → callback that sets selectedMovie here
                                    in App when a card is clicked

                  map() note (applies to each Row internally):
                  map returns a new array of JSX elements — key prop helps
                  React identify which items changed, were added, or removed
                  between renders so it only updates the affected DOM nodes.
              ────────────────────────────────────────────────────────── */}
              <Row title="Trending Now"  fetchUrl={REQUESTS.trending} onMovieSelect={setSelectedMovie} />
              <Row title="Top Rated"     fetchUrl={REQUESTS.topRated} onMovieSelect={setSelectedMovie} />
              <Row title="Action"        fetchUrl={REQUESTS.action}   onMovieSelect={setSelectedMovie} />
              <Row title="Horror"        fetchUrl={REQUESTS.horror}   onMovieSelect={setSelectedMovie} />
            </>
          }
        />

        {/* ── Search route ────────────────────────────────────────────── */}
        <Route
          path="/search"
          element={<Search onMovieSelect={setSelectedMovie} />}
        />
      </Routes>

      {/* ── Movie detail modal (Stage 4) ─────────────────────────────────
          Rendered via React.createPortal into document.body.
          Why a Portal? It renders outside the component tree's DOM
          hierarchy, avoiding z-index and overflow:hidden issues from
          parent containers. See MovieModal.jsx for the full explanation.

          Shown when selectedMovie is not null.
          Closing sets selectedMovie back to null.
      ──────────────────────────────────────────────────────────────── */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

export default App;
