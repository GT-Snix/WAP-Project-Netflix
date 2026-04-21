import { createContext, useContext, useEffect, useState } from 'react';

const WatchlistContext = createContext(null);

function loadFromStorage() {
  try {
    const stored = localStorage.getItem('netflix_watchlist');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => loadFromStorage());

  useEffect(() => {
    try {
      localStorage.setItem('netflix_watchlist', JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  const addMovie = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) return prev;
      return [...prev, movie];
    });
  };

  const removeMovie = (movieId) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addMovie, removeMovie }}>
      {children}
    </WatchlistContext.Provider>
  );
}

function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error('useWatchlist must be used inside <WatchlistProvider>');
  }
  return ctx;
}

export { WatchlistProvider, useWatchlist };