import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar" id="main-navbar">
      <Link to="/" className="brand">
        <img src="./src/assets/logo.png" alt="sumn" />
      </Link>

      <div className="links">
        <Link
          to="/app"
          className={`link ${pathname === '/app' ? 'link-active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/search"
          className={`link ${pathname === '/search' ? 'link-active' : ''}`}
        >
          Search
        </Link>
        <Link
          to="/watchlist"
          className={`link ${pathname === '/watchlist' ? 'link-active' : ''}`}
        >
          My List
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;