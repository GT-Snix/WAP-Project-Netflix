import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from './assets/logo.png';

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar" id="main-navbar">
      <Link to="/" className="brand">
        <img src={logo} alt="logo" />
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