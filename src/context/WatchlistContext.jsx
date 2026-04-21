import { createContext, useContext, useReducer, useEffect } from 'react';

/**
 * WatchlistContext
 * ────────────────
 * WHY useReducer INSTEAD OF useState FOR COMPLEX STATE:
 * useState is great for simple, independent pieces of state (a boolean, a
 * string, a single number). But when state transitions depend on the
 * previous state AND there are multiple "action types" (add, remove, clear),
 * useReducer is the better tool because:
 *
 *   1. All state logic lives in ONE pure function (the reducer), making it
 *      easy to test and reason about — you pass in (currentState, action)
 *      and get back the new state. No side effects, no scattered setX calls.
 *
 *   2. The dispatch function is STABLE — its identity never changes between
 *      renders (unlike a useState setter wrapped in a callback). This means
 *      components consuming dispatch via context won't re-render just
 *      because the parent re-rendered.
 *
 *   3. It scales: if you need to add CLEAR_LIST or TOGGLE_MOVIE later,
 *      you just add a new case to the switch — no new useState + handler.
 *
 * PERSISTENCE:
 *   A useEffect watches `state` and writes to localStorage on every change,
 *   so the watchlist survives page refreshes. On mount, the initial state
 *   is loaded from localStorage (or falls back to an empty array).
 */

// ── Read initial state from localStorage ──────────────────────────────────
function loadFromStorage() {
  try {
    const stored = localStorage.getItem('netflix_watchlist');
    return stored ? JSON.parse(stored) : [];
  } catch {
    // If localStorage is corrupted or unavailable, start fresh
    return [];
  }
}

// ── Reducer ───────────────────────────────────────────────────────────────
// Pure function: (state, action) → newState. No side effects.
function watchlistReducer(state, action) {
  switch (action.type) {
    case 'ADD_MOVIE': {
      // Prevent duplicates — if the movie is already in the list, skip
      const exists = state.find((m) => m.id === action.payload.id);
      if (exists) return state;
      return [...state, action.payload];
    }

    case 'REMOVE_MOVIE': {
      // Filter out the movie with the matching id
      return state.filter((m) => m.id !== action.payload);
    }

    default:
      console.warn(`WatchlistReducer: unknown action type "${action.type}"`);
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────
const WatchlistContext = createContext(null);

/**
 * WatchlistProvider
 * Wraps the component tree so any child can access the watchlist via
 * useWatchlist(). Provides both the current list AND the dispatch function.
 */
function WatchlistProvider({ children }) {
  const [watchlist, dispatch] = useReducer(watchlistReducer, null, loadFromStorage);

  // ── Persist to localStorage on every change ─────────────────────────────
  // useEffect runs AFTER render, so it won't block painting.
  // Every time `watchlist` changes (add/remove), we serialize to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem('netflix_watchlist', JSON.stringify(watchlist));
    } catch {
      // localStorage might be full or disabled — fail silently
    }
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={{ watchlist, dispatch }}>
      {children}
    </WatchlistContext.Provider>
  );
}

/**
 * useWatchlist — convenience hook so consumers don't need to import
 * both useContext and WatchlistContext.
 *
 * Returns { watchlist, dispatch } where:
 *   watchlist → the current array of saved movies
 *   dispatch  → call dispatch({ type: 'ADD_MOVIE', payload: movie })
 *               or   dispatch({ type: 'REMOVE_MOVIE', payload: movieId })
 */
function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error('useWatchlist must be used inside <WatchlistProvider>');
  }
  return ctx;
}

export { WatchlistProvider, useWatchlist };
