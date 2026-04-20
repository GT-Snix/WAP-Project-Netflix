import React from 'react';
import './MovieCard.css';

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w342';

/**
 * MovieCard
 * ─────────
 * Renders a single movie poster inside a card wrapper.
 *
 * Hover behaviour is handled 100 % in CSS (see MovieCard.css):
 *  - .movie-card__overlay starts at opacity 0
 *  - :hover on the parent raises it to opacity 1
 * No JS touchHandler / onMouseEnter needed — pure CSS transition.
 */

// React.memo prevents re-renders when the parent Row re-renders
// but this card's `movie` prop hasn't actually changed.
const MovieCard = React.memo(({ movie }) => {
  const title = movie.title || movie.name || 'Untitled';
  const posterUrl = movie.poster_path
    ? `${TMDB_IMG_BASE}${movie.poster_path}`
    : 'https://via.placeholder.com/342x513?text=No+Image';

  return (
    <div className="movie-card">
      <img
        className="movie-card__poster"
        src={posterUrl}
        alt={title}
        loading="lazy"
      />

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
