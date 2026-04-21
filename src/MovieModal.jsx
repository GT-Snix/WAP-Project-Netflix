import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './MovieModal.css';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE  = 'https://image.tmdb.org/t/p/original';
const API_KEY   = import.meta.env.VITE_TMDB_KEY;

/**
 * MovieModal
 * ──────────
 * Rendered via React.createPortal into document.body.
 *
 * WHY USE A PORTAL?
 * Normally, React renders a component's output inside the parent's DOM node.
 * If any ancestor has `overflow: hidden`, `z-index` stacking context, or
 * CSS `transform`, a regular modal would be clipped or hidden behind other
 * elements. createPortal renders the modal's DOM nodes as direct children of
 * document.body — completely outside the component tree's DOM hierarchy —
 * so it always sits on top of everything. Despite living outside the DOM
 * tree, the modal still participates in React's *component* tree, meaning
 * events still bubble through React's synthetic event system, context still
 * works, and state updates flow normally.
 *
 * Props:
 *   movie   {object|null} – The selected movie object from TMDB
 *   onClose {function}    – Sets selectedMovie to null in the parent (App)
 */
function MovieModal({ movie, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [genres, setGenres]         = useState([]);

  // ── Fetch trailer + movie details when a movie is selected ──────────────
  // We need two pieces of data that aren't in the list response:
  //   1. YouTube trailer key from /movie/{id}/videos
  //   2. Full genre names from /movie/{id} (list response only has genre_ids)
  useEffect(() => {
    if (!movie) return;

    const controller = new AbortController();

    async function fetchDetails() {
      try {
        // Fetch videos (trailers, teasers, etc.)
        const videosRes = await fetch(
          `${TMDB_BASE}/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`,
          { signal: controller.signal }
        );
        const videosJson = await videosRes.json();

        // Find the first YouTube trailer; fall back to any YouTube video
        const trailer =
          videosJson.results?.find(
            (v) => v.site === 'YouTube' && v.type === 'Trailer'
          ) ||
          videosJson.results?.find((v) => v.site === 'YouTube');

        setTrailerKey(trailer?.key ?? null);

        // Fetch full movie details for genre names
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

    // Cleanup: cancel in-flight requests if modal closes or movie changes
    return () => {
      controller.abort();
      setTrailerKey(null);
      setGenres([]);
    };
  }, [movie]);

  // ── Close on Escape key ──────────────────────────────────────────────────
  useEffect(() => {
    if (!movie) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [movie, onClose]);

  // Don't render anything if no movie is selected
  if (!movie) return null;

  const title       = movie.title || movie.name || 'Untitled';
  const releaseDate = movie.release_date || movie.first_air_date || 'N/A';
  const rating      = movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'N/A';
  const overview    = movie.overview || 'No overview available.';
  const backdropUrl = movie.backdrop_path
    ? `${IMG_BASE}${movie.backdrop_path}`
    : null;

  // Join genre names with a bullet separator using .join()
  // e.g. ["Action", "Sci-Fi", "Drama"] → "Action • Sci-Fi • Drama"
  const genreString = genres.map((g) => g.name).join(' • ');

  // ── Portal: render into document.body, outside the React DOM tree ──────
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation prevents clicks inside the modal from
          bubbling up to the overlay and triggering onClose */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Close button — sets selectedMovie to null in App */}
        <button className="modal__close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* ── Backdrop image ─────────────────────────────────────────── */}
        {backdropUrl && (
          <div
            className="modal__backdrop"
            style={{ backgroundImage: `url(${backdropUrl})` }}
            role="img"
            aria-label={`${title} backdrop`}
          />
        )}

        <div className="modal__body">
          <h2 className="modal__title">{title}</h2>

          <div className="modal__meta">
            <span className="modal__date">📅 {releaseDate}</span>
            <span className="modal__rating">⭐ {rating}</span>
          </div>

          {/* Genres joined with • separator */}
          {genreString && (
            <p className="modal__genres">{genreString}</p>
          )}

          <p className="modal__overview">{overview}</p>

          {/* ── YouTube trailer iframe ──────────────────────────────── */}
          {/* Fetched from /movie/{id}/videos via useEffect above.
              Only rendered if a YouTube trailer key was found.         */}
          {trailerKey && (
            <div className="modal__trailer">
              <iframe
                className="modal__iframe"
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
    document.body  // ← Portal target: renders outside <div id="root">
  );
}

export default MovieModal;
