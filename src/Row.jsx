import { useState, useEffect } from 'react';
import './Row.css';

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, onMovieSelect }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const response = await fetch(`https://api.themoviedb.org/3${fetchUrl}`, {
          signal: controller.signal
        });
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching data:", error);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [fetchUrl]);

  return (
    <div className="row">
      <h2>{title}</h2>
      
      {/* We use map() to return JSX for each movie. Every element in the 
          React array needs a stable, unique 'key' so React can effectively
          track which items change, get added, or removed. */}
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => onMovieSelect(movie)}
            className="row__poster"
            src={`${base_url}${movie.poster_path}`}
            alt={movie.name || movie.title}
          />
        ))}
      </div>
    </div>
  );
}

export default Row;
