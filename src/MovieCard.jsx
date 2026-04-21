import React from 'react';
import { useWatchlist } from './context/WatchlistContext';
import './MovieCard.css';

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w342';

/**
 * MovieCard
 * ─────────
 * Renders a single movie poster inside a card wrapper.
 *
 * React.memo does a shallow comparison of props — if props haven't changed,
 * the component doesn't re-render. This matters because every time App
 * re-renders (e.g. modal opens), all MovieCards would re-render without
 * memo. Shallow comparison means it checks each prop with === (referential
 * equality). For primitive props like `movie.id` that's straightforward,
 * but for function props like `onSelect`, we need useCallback in the parent
 * to keep the same function reference — otherwise memo sees a "new" function
 * every render and re-renders anyway.
 *
 * onClick behaviour:
 *   When the card is clicked, it calls `onSelect(movie)` — a callback
 *   passed down from App via Row. This is the "LIFTING STATE UP" pattern:
 *   the child (MovieCard) doesn't own the selectedMovie state; it simply
 *   tells the parent (App) what was clicked, and the parent decides what
 *   to do (open the MovieModal). This keeps the source of truth in one
 *   place and avoids multiple components trying to manage the same state.
 *
 * Hover behaviour is handled 100 % in CSS (see MovieCard.css):
 *  - .movie-card__overlay starts at opacity 0
 *  - :hover on the parent raises it to opacity 1
 * No JS touchHandler / onMouseEnter needed — pure CSS transition.
 */

// React.memo does a shallow comparison of props — if props haven't changed,
// the component doesn't re-render. This matters because every time App
// re-renders (e.g. modal opens), all MovieCards would re-render without memo.
const MovieCard = React.memo(({ movie, onSelect }) => {
  const { watchlist, dispatch } = useWatchlist();

  const title = movie.title || movie.name || 'Untitled';
  const posterUrl = movie.poster_path
    ? `${TMDB_IMG_BASE}${movie.poster_path}`
    : 'https://via.placeholder.com/342x513?text=No+Image';

  // Check if this movie is already in the watchlist using .find()
  // .find() returns the first element matching the condition, or undefined
  const isInWatchlist = watchlist.find((m) => m.id === movie.id);

  const handleWatchlistClick = (e) => {
    // Stop the click from bubbling up to the card's onClick (which opens the modal)
    e.stopPropagation();

    if (isInWatchlist) {
      dispatch({ type: 'REMOVE_MOVIE', payload: movie.id });
    } else {
      dispatch({ type: 'ADD_MOVIE', payload: movie });
    }
  };

  return (
    // LIFTING STATE UP: onClick calls onSelect(movie) which propagates
    // the clicked movie object upward to App.jsx → selectedMovie state.
    <div className="movie-card" onClick={() => onSelect?.(movie)}>
      <img
        className="movie-card__poster"
        src={posterUrl}
        alt={title}
        loading="lazy"
      />

      {/* ── Watchlist toggle button ──────────────────────────────────────
          Shows "+" if not in watchlist, "✓" if already added.
          stopPropagation prevents the card's onClick from firing.
          Dispatches ADD_MOVIE or REMOVE_MOVIE to WatchlistContext.    */}
      <button
        className={`movie-card__watchlist-btn ${isInWatchlist ? 'movie-card__watchlist-btn--active' : ''}`}
        onClick={handleWatchlistClick}
        aria-label={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
        title={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
      >
        {isInWatchlist ? '✓' : '+'}
      </button>

      {/* Dark overlay — visibility controlled entirely by CSS :hover,
          no JS state change means no extra React re-render on hover */}
      <div className="movie-card__overlay">
        <span className="movie-card__title">{title}</span>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
