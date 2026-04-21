import { useRef } from 'react';
import useFetch from './hooks/useFetch';
import MovieCard from './MovieCard';
import './Row.css';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_KEY;

function Row({ title, fetchUrl, onMovieSelect }) {
  const sep = fetchUrl.includes('?') ? '&' : '?';
  const fullUrl = `${TMDB_BASE}${fetchUrl}${sep}api_key=${API_KEY}&language=en-US`;
  const { data, loading, error } = useFetch(fullUrl);

  const movies = data?.results ?? [];
  const rowRef = useRef(null);

  const scrollLeft = () => {
    rowRef.current?.scrollBy({ left: -600, behavior: 'smooth' });
  };

  const scrollRight = () => {
    rowRef.current?.scrollBy({ left: 600, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="row">
        <h2 className="title">{title}</h2>
        <div className="skeleton-wrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row">
        <h2 className="title">{title}</h2>
        <p className="error">Could not load movies: {error}</p>
      </div>
    );
  }

  return (
    <div className="row">
      <h2 className="title">{title}</h2>

      <div className="wrap">
        <button
          className="arrow arrow-left"
          onClick={scrollLeft}
          aria-label={`Scroll ${title} left`}
        >
          
        </button>

        <div className="strip" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onMovieSelect}
            />
          ))}
        </div>

        <button
          className="arrow arrow-right"
          onClick={scrollRight}
          aria-label={`Scroll ${title} right`}
        >
          
        </button>
      </div>
    </div>
  );
}

export default Row;