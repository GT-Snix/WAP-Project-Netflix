import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import Row from './Row';
import Search from './Search';
import Watchlist from './Watchlist';
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
  // propagates up through Row → App via the handleCardClick callback,
  // updating this state. This is "lifting state up" — the child doesn't
  // own the state, it tells the parent what happened, and the parent
  // decides what to do (render the modal).
  const [selectedMovie, setSelectedMovie] = useState(null);

  // ── useCallback for the card click handler ──────────────────────────────
  // useCallback returns the SAME function reference between renders.
  // Without it, a new function object is created each render, which breaks
  // React.memo's shallow comparison (referential equality). React.memo on
  // MovieCard checks if onSelect === previous onSelect. If we wrote
  //   onMovieSelect={setSelectedMovie}
  // directly, setSelectedMovie is already stable (React guarantees state
  // setters are stable). But wrapping in useCallback is the general pattern
  // for when the callback does more than just call a setter — and it makes
  // the intent explicit: "this function identity should NOT change."
  const handleCardClick = useCallback((movie) => {
    setSelectedMovie(movie);
  }, []);
  // Empty dependency array [] → the function is created once and reused
  // forever. If it depended on some outer variable, that variable would
  // go in the array so the function updates when the dependency changes.

  // ── Close modal handler (also stable via useCallback) ───────────────────
  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <div className="app">
      {/* ── Navbar — fixed top bar with Home, Search, My List links ── */}
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
                    onMovieSelect → stable callback (via useCallback) that
                                    sets selectedMovie when a card is clicked

                  map() note (applies to each Row internally):
                  map returns a new array of JSX elements — key prop helps
                  React identify which items changed, were added, or removed
                  between renders so it only updates the affected DOM nodes.
              ────────────────────────────────────────────────────────── */}
              <Row title="Trending Now"  fetchUrl={REQUESTS.trending} onMovieSelect={handleCardClick} />
              <Row title="Top Rated"     fetchUrl={REQUESTS.topRated} onMovieSelect={handleCardClick} />
              <Row title="Action"        fetchUrl={REQUESTS.action}   onMovieSelect={handleCardClick} />
              <Row title="Horror"        fetchUrl={REQUESTS.horror}   onMovieSelect={handleCardClick} />
            </>
          }
        />

        {/* ── Search route ────────────────────────────────────────────── */}
        <Route
          path="/search"
          element={<Search onMovieSelect={handleCardClick} />}
        />

        {/* ── Watchlist route (Stage 5) ───────────────────────────────── */}
        <Route
          path="/watchlist"
          element={<Watchlist onMovieSelect={handleCardClick} />}
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
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
