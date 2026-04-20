import useFetch from './hooks/useFetch';
import './Hero.css';

// Base URL for TMDB backdrop images — "original" gives us full resolution
const IMG_BASE = 'https://image.tmdb.org/t/p/original';

// TMDB trending endpoint: returns the most-watched movie of the day.
// We always read index [0] — the #1 trending movie.
const API_KEY = import.meta.env.VITE_TMDB_KEY;
const TRENDING_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&language=en-US`;

function Hero() {
  const { data, loading, error } = useFetch(TRENDING_URL);

  // ── Loading state: dark placeholder keeps layout stable ──
  if (loading) {
    return <div className="hero--loading" aria-label="Loading hero banner" />;
  }

  // ── Error state ──
  if (error || !data?.results?.length) {
    return (
      <div className="hero--error">
        <p>Could not load featured title.</p>
      </div>
    );
  }

  // Pick the first trending movie (index 0 = today's #1)
  const movie = data.results[0];

  const backdropUrl = movie.backdrop_path
    ? `${IMG_BASE}${movie.backdrop_path}`
    : null;

  // WHY slice(0, 150)?
  // TMDB overviews can be 400+ characters. Long text pushes the buttons
  // off-screen on small viewports and makes the banner feel cluttered.
  // slice() gives us a hard cut at 150 chars; the trailing '…' signals
  // the user there's more in the detail view (Modal / More Info).
  const shortOverview = movie.overview
    ? movie.overview.slice(0, 150) + (movie.overview.length > 150 ? '…' : '')
    : 'No description available.';

  const title = movie.title || movie.name || 'Untitled';

  return (
    <section className="hero" aria-label={`Featured movie: ${title}`}>
      {/* Full-bleed backdrop image; gradient overlay defined in ::after */}
      {backdropUrl && (
        <div
          className="hero__backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
          role="img"
          aria-label={`${title} backdrop`}
        />
      )}

      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>

        <p className="hero__overview">{shortOverview}</p>

        <div className="hero__buttons">
          {/* ▶ Play — filled white, Netflix signature */}
          <button className="hero__btn hero__btn--play" id="hero-play-btn">
            {/* Unicode ▶ play symbol — no icon library needed */}
            <span aria-hidden="true">▶</span> Play
          </button>

          {/* ⓘ More Info — grey translucent, opens detail view */}
          <button className="hero__btn hero__btn--info" id="hero-info-btn">
            <span aria-hidden="true">ⓘ</span> More Info
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
