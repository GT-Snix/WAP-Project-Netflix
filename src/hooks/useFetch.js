import { useState, useEffect } from 'react';

/**
 * useFetch — a reusable data-fetching hook.
 *
 * @param {string} url  The full URL to fetch.
 * @returns {{ data: any, loading: boolean, error: string|null }}
 */
function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // AbortController lets us cancel the in-flight fetch if the component
    // unmounts OR if `url` changes before the previous request finishes.
    // Without this, a slow response arriving after unmount would try to
    // call setData/setLoading on an unmounted component — a React no-op
    // warning (and potential memory leak in older React versions).
    const controller = new AbortController();

    // Reset state for every new URL so stale data never flickers.
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`HTTP error — status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        // AbortError is intentional (cleanup), not a real error.
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        // Only mark loading done when the fetch was NOT aborted.
        // If it was aborted, the component is gone — no state update needed.
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    // CLEANUP FUNCTION: React calls this before re-running the effect
    // (when `url` changes) and when the component unmounts.
    // controller.abort() cancels the pending fetch so we never process
    // a response that belongs to a previous URL or a dead component.
    return () => {
      controller.abort();
    };

    // WHY `url` IS IN THE DEPENDENCY ARRAY:
    // useEffect re-runs whenever any value listed here changes.
    // If we omitted `url`, the hook would only ever fetch the *first* URL
    // it received and would never update when the caller passes a new URL.
    // Listing `url` ensures we fire a fresh fetch every time the URL changes.
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
