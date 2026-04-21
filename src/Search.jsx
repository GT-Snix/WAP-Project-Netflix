import { useState } from 'react';
import useFetch from './hooks/useFetch';
import useDebounce from './hooks/useDebounce';
import MovieCard from './MovieCard';
import './Search.css';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY   = import.meta.env.VITE_TMDB_KEY;

/**
 * Search
 * ──────
 * A dedicated search page accessible via /search route.
 *
 * CONTROLLED COMPONENT PATTERN:
 * The <input> below is a "controlled component" — its `value` is driven by
 * React state (`query`), and every keystroke fires `onChange` which calls
 * setQuery. React is the single source of truth for the input's value.
 * This is the opposite of an "uncontrolled component" where the DOM itself
 * owns the value and you read it with a ref. Controlled inputs give us
 * full programmatic control (validation, formatting, disabling submit, etc.)
 *
 * Props:
 *   onMovieSelect {function} – Callback to lift the clicked movie up to App
 */
function Search({ onMovieSelect }) {
  // ── Controlled input state ──────────────────────────────────────────────
  // `query` updates on EVERY keystroke (controlled component).
  // `debouncedQuery` only updates 500 ms after the user STOPS typing.
  const [query, setQuery] = useState('');

  // useDebounce waits 500 ms of inactivity before updating.
  // This prevents firing a network request on every single keystroke.
  // See hooks/useDebounce.js for a full explanation of how debouncing works.
  const debouncedQuery = useDebounce(query, 500);

  // ── Fetch search results using the debounced query ──────────────────────
  // useFetch is only called with a real URL when debouncedQuery is non-empty.
  // Passing null/empty skips the fetch entirely inside useFetch.
  const searchUrl = debouncedQuery
    ? `${TMDB_BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(debouncedQuery)}`
    : null;

  const { data, loading, error } = useFetch(searchUrl);
  const movies = data?.results ?? [];

  return (
    <div className="search">
      <div className="search__bar">
        {/* 🔍 Controlled input — value is always === query (React state).
            onChange fires setQuery on every keystroke, re-rendering the
            component and keeping the input in sync with state.            */}
        <input
          className="search__input"
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          id="search-input"
        />
        {/* Visual feedback: show a subtle spinner while debounce is pending
            or fetch is loading */}
        {(query !== debouncedQuery || loading) && debouncedQuery && (
          <span className="search__spinner" aria-label="Searching…" />
        )}
      </div>

      {/* ── Error state ──────────────────────────────────────────────── */}
      {error && (
        <p className="search__error">⚠️ Search failed: {error}</p>
      )}

      {/* ── Results grid ─────────────────────────────────────────────── */}
      <div className="search__results">
        {/*
          map() returns a new array of JSX elements — key prop helps
          React identify which items changed, were added, or were removed
          between renders, so it can update only those DOM nodes instead
          of re-rendering the whole list.
        */}
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={onMovieSelect}
          />
        ))}
      </div>

      {/* ── Empty states ─────────────────────────────────────────────── */}
      {!loading && debouncedQuery && movies.length === 0 && !error && (
        <p className="search__empty">No results found for "{debouncedQuery}"</p>
      )}

      {!debouncedQuery && (
        <p className="search__hint">Start typing to search for movies…</p>
      )}
    </div>
  );
}

export default Search;
