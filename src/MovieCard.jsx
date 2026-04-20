import React from 'react';

const base_url = "https://image.tmdb.org/t/p/original/";

// By wrapping the component in React.memo, React will memorize the rendered output
// and only re-render if the props change. Since we pass the same primitive values
// and referentially equal functions (via useCallback), this prevents wasted renders
// when the parent <Row> or <App> updates.
const MovieCard = React.memo(({ movie, onClick }) => {
  return (
    <img
      onClick={() => onClick(movie)}
      className="row__poster"
      src={`${base_url}${movie.poster_path}`}
      alt={movie.name || movie.title}
    />
  );
});

// React component display names can be lost with React.memo, this helps with debugging
MovieCard.displayName = 'MovieCard';

export default MovieCard;
