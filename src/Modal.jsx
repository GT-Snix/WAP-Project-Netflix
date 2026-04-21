import './Modal.css';

function Modal({ isOpen, movie, onClose }) {
  if (!isOpen || !movie) return null;

  return (
    <div className="simple-overlay" onClick={onClose}>
      <div className="simple-modal" onClick={(e) => e.stopPropagation()}>
        <button className="simple-close" onClick={onClose}>
          X
        </button>
        <h2>{movie.title || movie.name}</h2>
        <p className="simple-overview">{movie.overview}</p>
        <p className="date">
          Release Date: {movie.release_date || movie.first_air_date}
        </p>
        <p className="rating">
          Rating: {movie.vote_average}/10
        </p>
      </div>
    </div>
  );
}

export default Modal;