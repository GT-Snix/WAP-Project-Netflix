import MovieCard from './MovieCard';
import { useWatchlist } from './context/WatchlistContext';
import './Watchlist.css';

function Watchlist({ onMovieSelect }) {
  const { watchlist } = useWatchlist();

  return (
    <div className="watchlist">
      <h1 className="heading">My List</h1>

      {watchlist.length === 0 ? (
        <div className="empty">
          <p className="empty-text">Your list is empty.</p>
          <p className="empty-hint">
            Browse movies and tap the <strong>+</strong> button to add them here.
          </p>
        </div>
      ) : (
        <div className="grid">
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