import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import Row from './Row';
import Search from './Search';
import Watchlist from './Watchlist';
import MovieModal from './MovieModal';
import './App.css';

const REQUESTS = {
  trending: '/trending/movie/week',
  topRated: '/movie/top_rated',
  action: '/discover/movie?with_genres=28',
  horror: '/discover/movie?with_genres=27',
};

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Row title="Trending Now" fetchUrl={REQUESTS.trending} onMovieSelect={setSelectedMovie} />
              <Row title="Top Rated" fetchUrl={REQUESTS.topRated} onMovieSelect={setSelectedMovie} />
              <Row title="Action" fetchUrl={REQUESTS.action} onMovieSelect={setSelectedMovie} />
              <Row title="Horror" fetchUrl={REQUESTS.horror} onMovieSelect={setSelectedMovie} />
            </>
          }
        />
        <Route path="/search" element={<Search onMovieSelect={setSelectedMovie} />} />
        <Route path="/watchlist" element={<Watchlist onMovieSelect={setSelectedMovie} />} />
      </Routes>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

export default App;