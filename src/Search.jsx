import { useState } from 'react';
import useFetch from './hooks/useFetch';
import useDebounce from './hooks/useDebounce';
import MovieCard from './MovieCard';
import './Search.css';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_KEY;

function Search({ onMovieSelect }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const searchUrl = debouncedQuery
    ? `${TMDB_BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(debouncedQuery)}`
    : null;

  const { data, loading, error } = useFetch(searchUrl);
  const movies = data?.results ?? [];

  return (
    <div className="search">
      <div className="bar">
        <input
          className="input"
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          id="search-input"
        />
        {(query !== debouncedQuery || loading) && debouncedQuery && (
          <span className="spinner" aria-label="Searching..." />
        )}
      </div>

      {error && <p className="error">Search failed: {error}</p>}

      <div className="results">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={onMovieSelect}
          />
        ))}
      </div>

      {!loading && debouncedQuery && movies.length === 0 && !error && (
        <p className="empty">No results found for "{debouncedQuery}"</p>
      )}

      {!debouncedQuery && (
        <p className="hint">Start typing to search for movies...</p>
      )}
    </div>
  );
}

export default Search;