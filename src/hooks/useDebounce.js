import { useState, useEffect } from 'react';

/**
 * useDebounce
 * ───────────
 * WHAT IS DEBOUNCING?
 * Debouncing delays the execution of a function until a certain amount of
 * time has passed since the LAST call. If the function is called again
 * before the delay expires, the previous timer is cleared and a new one
 * starts. This is essential for search inputs — without debounce, every
 * single keystroke would fire a network request to TMDB. With a 500 ms
 * debounce, we wait until the user pauses typing for half a second before
 * actually fetching, drastically cutting unnecessary API calls.
 *
 * HOW IT WORKS:
 * 1. We store a `debouncedValue` in state.
 * 2. Every time `value` changes a useEffect schedules a setTimeout.
 * 3. If `value` changes AGAIN before the timeout fires, the cleanup
 *    function (return () => clearTimeout) cancels the old timer.
 * 4. Only when the user stops changing `value` for `delay` ms does the
 *    setTimeout callback run and update `debouncedValue`, which triggers
 *    the consumer (e.g. a useFetch call in Search) to fetch new results.
 *
 * @param {any}    value  The raw value that changes frequently (e.g. input text)
 * @param {number} delay  Milliseconds to wait after the last change (default 500)
 * @returns {any}         The debounced version of that value
 */
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer — it will update debouncedValue after `delay` ms
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // CLEANUP: if `value` changes before the timer fires, cancel it.
    // This is the core of debouncing — only the LAST call "wins".
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
