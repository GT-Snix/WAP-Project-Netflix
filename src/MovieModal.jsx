import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './MovieModal.css';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/original';
const API_KEY = import.meta.env.VITE_TMDB_KEY;

function MovieModal({ movie, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (!movie) return;

    const controller = new AbortController();

    async function fetchDetails() {
      try {
        const videosRes = await fetch(
          `${TMDB_BASE}/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`,
          { signal: controller.signal }
        );
        const videosJson = await videosRes.json();

        const trailer =
          videosJson.results?.find(
            (v) => v.site === 'YouTube' && v.type === 'Trailer'
          ) ||
          videosJson.results?.find((v) => v.site === 'YouTube');

        setTrailerKey(trailer?.key ?? null);

        const detailRes = await fetch(
          `${TMDB_BASE}/movie/${movie.id}?api_key=${API_KEY}&language=en-US`,
          { signal: controller.signal }
        );
        const detailJson = await detailRes.json();
        setGenres(detailJson.genres ?? []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch movie details:', err);
        }
      }
    }

    fetchDetails();

    return () => {
      controller.abort();
      setTrailerKey(null);
      setGenres([]);
    };
  }, [movie]);

  useEffect(() => {
    if (!movie) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [movie, onClose]);

  if (!movie) return null;

  const title = movie.title || movie.name || 'Untitled';
  const releaseDate = movie.release_date || movie.first_air_date || 'N/A';
  const rating = movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'N/A';
  const overview = movie.overview || 'No overview available.';
  const backdropUrl = movie.backdrop_path
    ? `${IMG_BASE}${movie.backdrop_path}`
    : null;

  const genreString = genres.map((g) => g.name).join(' • ');

  return createPortal(
    <div className="movie-overlay" onClick={onClose}>
      <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
        <button className="movie-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {backdropUrl && (
          <div
            className="movie-banner"
            style={{ backgroundImage: `url(${backdropUrl})` }}
            role="img"
            aria-label={`${title} backdrop`}
          />
        )}

        <div className="movie-body">
          <h2 className="movie-title">{title}</h2>

          <div className="movie-meta">
            <span className="movie-date">{releaseDate}</span>
            <span className="movie-rating">{rating}</span>
          </div>

          {genreString && <p className="movie-genres">{genreString}</p>}

          <p className="movie-overview">{overview}</p>

          {trailerKey && (
            <div className="movie-trailer">
              <iframe
                className="movie-video"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
                title={`${title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default MovieModal;