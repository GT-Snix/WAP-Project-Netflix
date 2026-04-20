import { useState, useEffect } from 'react'
import requests from './api'
import './App.css'

function App() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    // We use an AbortController for cleanup to prevent race conditions or memory leaks
    // if the component unmounts before the fetch finishes.
    const controller = new AbortController();

    async function fetchData() {
      try {
        const response = await fetch(`https://api.themoviedb.org/3${requests.fetchTrending}`, {
          signal: controller.signal
        });
        const data = await response.json();
        setTrending(data.results || []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching data:", error);
        }
      }
    }

    fetchData();

    // Cleanup function runs when component unmounts or before re-running the effect
    return () => {
      controller.abort();
    };
  }, []); // Empty dependency array means this effect runs exactly once when the component mounts

  return (
    <div className="app">
      <h1>Netflix Clone</h1>
      {/* We will add Row components here in the next step */}
      <p>Loaded {trending.length} trending items.</p>
    </div>
  )
}

export default App
