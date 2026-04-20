import { useRef } from 'react';
import useFetch from './hooks/useFetch';
import MovieCard from './MovieCard';
import './Row.css';

// Base URL shared by every TMDB image request
const TMDB_BASE = 'https://api.themoviedb.org/3';

// Build the full TMDB URL from a relative fetchUrl prop.
// VITE_ prefix makes the key visible to browser code (Vite strips
// all other env vars from the client bundle for security).
const API_KEY = import.meta.env.VITE_TMDB_KEY;

/**
 * Row
 * ───
 * Props:
 *   title    {string}  – Section heading shown above the row
 *   fetchUrl {string}  – Relative TMDB path, e.g. "/trending/movie/week"
 *
 * Scroll arrows:
 *   We store a ref to the scrollable <div> with useRef().
 *   WHY useRef AND NOT useState?
 *   useRef returns a plain mutable object { current: ... } that lives
 *   outside React's render cycle. Mutating ref.current NEVER triggers a
 *   re-render, which is exactly what we want here — clicking a scroll
 *   arrow should only move the DOM element, not repaint the whole row.
 *   If we stored the DOM node in useState, every click would set state,
 *   schedule a render, diff the VDOM, and commit — all unnecessary work.
 */
function Row({ title, fetchUrl }) {
  // ── Data fetching via the custom hook ────────────────────────────────────
  // useFetch handles loading, error, AbortController cleanup internally.
  // If fetchUrl already contains '?' (e.g. /discover/movie?with_genres=28),
  // we join with '&'; otherwise we start the query string with '?'.
  const sep = fetchUrl.includes('?') ? '&' : '?';
  const fullUrl = `${TMDB_BASE}${fetchUrl}${sep}api_key=${API_KEY}&language=en-US`;
  const { data, loading, error } = useFetch(fullUrl);

  // movies is the `results` array from the TMDB JSON response
  const movies = data?.results ?? [];

  // ── Scroll ref ───────────────────────────────────────────────────────────
  // useRef attaches to the DOM node once via ref={rowRef}.
  // Clicking arrows calls rowRef.current.scrollBy() — a direct DOM
  // manipulation with zero React state / re-render involved.
  const rowRef = useRef(null);

  const scrollLeft = () => {
    rowRef.current?.scrollBy({ left: -600, behavior: 'smooth' });
  };

  const scrollRight = () => {
    rowRef.current?.scrollBy({ left: 600, behavior: 'smooth' });
  };

  // ── Render guards ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="row">
        <h2 className="row__title">{title}</h2>
        <div className="row__skeleton-wrapper">
          {/* Render 8 skeleton cards while fetching */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="row__skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row">
        <h2 className="row__title">{title}</h2>
        <p className="row__error">⚠️ Could not load movies: {error}</p>
      </div>
    );
  }

  return (
    <div className="row">
      <h2 className="row__title">{title}</h2>

      <div className="row__wrapper">
        {/* Left scroll arrow */}
        <button
          className="row__arrow row__arrow--left"
          onClick={scrollLeft}
          aria-label={`Scroll ${title} left`}
        >
          ‹
        </button>

        {/* Horizontally scrollable container — ref lets us call scrollBy()
            directly on the DOM node without any state update */}
        <div className="row__posters" ref={rowRef}>
          {/*
            map() returns a new array of JSX elements — key prop helps
            React identify which items changed, were added, or were removed
            between renders, so it can update only those DOM nodes instead
            of re-rendering the whole list.
          */}
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right scroll arrow */}
        <button
          className="row__arrow row__arrow--right"
          onClick={scrollRight}
          aria-label={`Scroll ${title} right`}
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default Row;
