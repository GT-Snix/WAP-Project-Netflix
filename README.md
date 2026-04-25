# Streamflix / Netflix Clone

A Netflix-inspired movie browsing web app built with React and Vite. The app uses The Movie Database (TMDB) API for movie data, posters, backdrops, trailers, search results, and movie details.

The project includes a landing page, movie browsing rows, a rotating hero banner, debounced search, trailer/detail modals, and a persistent "My List" watchlist stored in the browser.

## Features

- Netflix-style landing page with email validation and call-to-action sections
- Browse page with TMDB-powered movie rows:
  - Trending Now
  - Top Rated
  - Action
  - Horror
- Auto-rotating hero banner using daily trending movies
- Movie cards with lazy-loaded poster images
- Movie detail modal with:
  - Backdrop image
  - Release date
  - Rating
  - Genres
  - Overview
  - Embedded YouTube trailer when available
- Debounced movie search to reduce unnecessary API requests
- Local watchlist with add/remove controls
- Watchlist persistence through `localStorage`
- Client-side routing with React Router
- Vercel rewrite configuration for SPA routing

## Tech Stack

- React 19
- Vite 8
- React Router DOM 7
- TMDB API
- CSS modules by component file convention
- ESLint

## Project Structure

```text
.
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── backdrop_landing.webp
│   │   ├── icon.png
│   │   └── logo.png
│   ├── context/
│   │   └── WatchlistContext.jsx
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   └── useFetch.js
│   ├── App.jsx
│   ├── Hero.jsx
│   ├── Landing.jsx
│   ├── MovieCard.jsx
│   ├── MovieModal.jsx
│   ├── Navbar.jsx
│   ├── Row.jsx
│   ├── Search.jsx
│   ├── Watchlist.jsx
│   ├── api.js
│   └── main.jsx
├── .env.example
├── eslint.config.js
├── package.json
├── vercel.json
└── vite.config.js
```

## Routes

| Route | Page | Description |
| --- | --- | --- |
| `/` | Landing | Marketing-style homepage with email input and feature sections |
| `/app` | Browse | Hero banner plus movie rows for trending, top-rated, action, and horror movies |
| `/search` | Search | Debounced movie search powered by TMDB |
| `/watchlist` | My List | Locally saved movies added from cards |

## Getting Started

### Prerequisites

- Node.js
- npm
- A TMDB API key

You can create a TMDB API key from the TMDB developer settings after creating an account.

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Update `.env` with your TMDB key:

```env
VITE_TMDB_KEY=your_tmdb_api_key_here
```

> Note: `VITE_TMDB_KEY` is the variable currently used by the React components. The `VITE_` prefix is required because Vite only exposes client-side environment variables with that prefix.

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server with hot module replacement.

```bash
npm run build
```

Creates a production build in the `dist/` directory.

```bash
npm run preview
```

Serves the production build locally for preview.

```bash
npm run lint
```

Runs ESLint across the project.

## Environment Variables

| Variable | Required | Used For |
| --- | --- | --- |
| `VITE_TMDB_KEY` | Yes | TMDB API requests for movies, search, details, genres, videos, posters, and backdrops |

The app calls TMDB directly from the browser, so this key is bundled into the client build. For a production application, consider routing TMDB requests through a backend or serverless function if you need stricter API key protection.

## TMDB Usage

The app uses these TMDB API areas:

- `/trending/movie/day` for the hero banner
- `/trending/movie/week` for the Trending Now row
- `/movie/top_rated` for top-rated movies
- `/discover/movie?with_genres=28` for action movies
- `/discover/movie?with_genres=27` for horror movies
- `/search/movie` for the search page
- `/movie/{id}` for movie details and genres
- `/movie/{id}/videos` for YouTube trailer lookup

Poster and backdrop images are loaded from TMDB image URLs:

- Posters: `https://image.tmdb.org/t/p/w342`
- Backdrops: `https://image.tmdb.org/t/p/original`

## Main Components

- `Landing.jsx`: Homepage with email validation and navigation into the app
- `Navbar.jsx`: Shared navigation between Landing, Home, Search, and My List
- `Hero.jsx`: Rotating featured movie banner from TMDB trending data
- `Row.jsx`: Horizontal scrollable movie rows
- `MovieCard.jsx`: Poster card with watchlist add/remove button
- `MovieModal.jsx`: Portal-based modal with details, genres, and trailer
- `Search.jsx`: Debounced TMDB movie search page
- `Watchlist.jsx`: Saved movies page
- `WatchlistContext.jsx`: Watchlist state and `localStorage` persistence
- `useFetch.js`: Abortable fetch hook with loading and error state
- `useDebounce.js`: Debounce hook used by search

## Watchlist Storage

The watchlist is stored in the browser under this key:

```text
netflix_watchlist
```

Because it uses `localStorage`, the list is device/browser-specific and does not sync across users or devices.

## Deployment

This project is ready for static deployment after building:

```bash
npm run build
```

The included `vercel.json` rewrites all routes to `index.html`, which allows React Router routes like `/app`, `/search`, and `/watchlist` to work after refreshes on Vercel.

When deploying, add this environment variable in the hosting provider dashboard:

```env
VITE_TMDB_KEY=your_tmdb_api_key_here
```

## Notes

- `.env.example` contains both `VITE_TMDB_API_KEY` and `VITE_TMDB_KEY`, but the current app code reads `VITE_TMDB_KEY`.
- `src/api.js` contains a reusable request map, though the active browse rows currently define their request paths directly in `App.jsx`.
- `src/Modal.jsx` is a simpler modal component kept in the codebase, while the app currently uses `MovieModal.jsx` for the richer trailer/detail experience.
- The landing page performs simple email validation by checking for `@` and a `.com` suffix before navigating to `/app`.

## Credits

- Movie data, posters, backdrops, genres, and videos are provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).
- The UI is inspired by Netflix-style streaming interfaces and is intended as an educational React project.
