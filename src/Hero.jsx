import {useState, useEffect} from 'react'
import useFetch from './hooks/useFetch';
import MovieModal from './MovieModal';
import './Hero.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/original';
const API_KEY = import.meta.env.VITE_TMDB_KEY;
const TRENDING_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&language=en-US`;

function Hero() {
  const [mov, setMov] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    let interval = setInterval(() => {
      setMov((prev) => {
        return (prev + 1) % 3
      });
    }, 5000);

    return ()=>clearInterval(interval);
  }, []);
  // console.log(TRENDING_URL)
  const { data, loading, error } = useFetch(TRENDING_URL);

  if (loading) {
    return <div className="banner-loading" />;
  }

  if (error || !data?.results?.length) {
    return (
      <div className="banner-error">
        <p>Could not load featured title.</p>
      </div>
    );
  }

  const movie = data.results[mov];
  const title = movie.title || movie.name || 'Untitled';
  const backdropUrl = movie.backdrop_path
    ? `${IMG_BASE}${movie.backdrop_path}`
    : null;

  const shortOverview = movie.overview
    ? movie.overview.slice(0, 150) + (movie.overview.length > 150 ? '…' : '')
    : 'No description available.';
  
    console.log(movie.title)

  return (
    <section className="banner">
      {backdropUrl && (
        <div
          className="banner-bg"
          style={{ backgroundImage: `url(${backdropUrl})` }}
          role="img"
          loading="lazy"
        />
      )}

      <div className="banner-content">
        <h1 className="banner-title">{title}</h1>
        <p className="banner-text">{shortOverview}</p>

        <div className="banner-actions">
          <button className="btn btn-play" id="hero-play-btn" onClick={() => setSelectedMovie(movie)}>
            <span>▶</span> Play
          </button>

          <button className="btn btn-info" id="hero-info-btn" onClick={() => setSelectedMovie(movie)}>
            <span>ⓘ</span> More Info
          </button>
        </div>
      </div>
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </section>
  );
}

export default Hero;