import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar
 * ──────
 * Fixed top navigation with links to Home (/) and Search (/search).
 * useLocation() highlights the active route.
 */
function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar" id="main-navbar">
      <Link to="/" className="navbar__brand">
        NETFLIX
      </Link>

      <div className="navbar__links">
        <Link
          to="/"
          className={`navbar__link ${pathname === '/' ? 'navbar__link--active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/search"
          className={`navbar__link ${pathname === '/search' ? 'navbar__link--active' : ''}`}
        >
          🔍 Search
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
