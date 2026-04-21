import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// BrowserRouter wraps the entire app so that react-router-dom's
// <Routes>, <Route>, <Link>, and useLocation() work everywhere.
// It uses the HTML5 History API (pushState / popState) to keep
// the URL in sync with the rendered UI without full page reloads.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
