import './Modal.css';

function Modal({ isOpen, movie, onClose }) {
  if (!isOpen || !movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
          X
        </button>
        <h2>{movie.title || movie.name}</h2>
        <p className="modal__overview">{movie.overview}</p>
        <p className="modal__date">Release Date: {movie.release_date || movie.first_air_date}</p>
        <p className="modal__rating">Rating: {movie.vote_average}/10</p>
      </div>
    </div>
  );
}

export default Modal;
