import { useState, useCallback } from 'react';
import requests from './api';
import Row from './Row';
import Modal from './Modal';
import './App.css';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieSelect = useCallback((movie) => {
    setSelectedMovie(movie);
  }, []);

  const handeCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <div className="app">
      <h1>Netflix Clone</h1>
      <Row title="Trending Now" fetchUrl={requests.fetchTrending} onMovieSelect={handleMovieSelect} />
      <Row title="Netflix Originals" fetchUrl={requests.fetchNetflixOriginals} onMovieSelect={handleMovieSelect} />
      <Row title="Top Rated" fetchUrl={requests.fetchTopRated} onMovieSelect={handleMovieSelect} />
      <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} onMovieSelect={handleMovieSelect} />
      <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} onMovieSelect={handleMovieSelect} />
      <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} onMovieSelect={handleMovieSelect} />
      <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} onMovieSelect={handleMovieSelect} />
      <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} onMovieSelect={handleMovieSelect} />

      {/* Controlled Component Pattern: The Modal is controlled entirely by its parent's state (selectedMovie) */}
      <Modal 
        isOpen={selectedMovie !== null} 
        movie={selectedMovie} 
        onClose={handeCloseModal} 
      />
    </div>
  );
}

export default App;
