import MovieCard from './MovieCard';
import { useWatchlist } from './context/WatchlistContext';
import './Watchlist.css';

/**
 * Watchlist
 * ─────────
 * Renders the user's saved movies (from WatchlistContext) in a CSS grid.
 * Accessible via the /watchlist route.
 *
 * Props:
 *   onMovieSelect {function} – Callback to open MovieModal when a card is clicked
 */
function Watchlist({ onMovieSelect }) {
  const { watchlist } = useWatchlist();

  return (
    <div className="watchlist">
      <h1 className="watchlist__heading">My List</h1>

      {watchlist.length === 0 ? (
        <div className="watchlist__empty">
          <p className="watchlist__empty-text">Your list is empty.</p>
          <p className="watchlist__empty-hint">
            Browse movies and tap the <strong>+</strong> button to add them here.
          </p>
        </div>
      ) : (
        <div className="watchlist__grid">
          {/*
            map() returns a new array of JSX elements — key prop helps
            React identify which items changed, were added, or were removed
            between renders, so it can update only those DOM nodes instead
            of re-rendering the whole list.
          */}
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onMovieSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;
