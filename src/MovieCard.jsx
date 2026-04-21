import React from 'react';
import { useWatchlist } from './context/WatchlistContext';
import './MovieCard.css';

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w342';

const MovieCard = React.memo(({ movie, onSelect }) => {
  const { watchlist, addMovie, removeMovie } = useWatchlist();

  const title = movie.title || movie.name || 'Untitled';
  const posterUrl = movie.poster_path
    ? `${TMDB_IMG_BASE}${movie.poster_path}`
    : 'https://via.placeholder.com/342x513?text=No+Image';

  const isInWatchlist = watchlist.find((m) => m.id === movie.id);

  const handleWatchlistClick = (e) => {
    e.stopPropagation();

    if (isInWatchlist) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  };

  return (
    <div className="card" onClick={() => onSelect?.(movie)}>
      <img
        className="poster"
        src={posterUrl}
        alt={title}
        loading="lazy"
      />

      <button
        className={`watch-btn ${isInWatchlist ? 'watch-btn-active' : ''}`}
        onClick={handleWatchlistClick}
        aria-label={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
        title={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
      >
        {isInWatchlist ? '✓' : '+'}
      </button>

      <div className="overlay">
        <span className="title">{title}</span>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;