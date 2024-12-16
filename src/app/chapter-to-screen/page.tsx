"use client";

import { useState } from "react";

export default function ChapterToScreen() {
  const [query, setQuery] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [recommendations, setRecommendations] = useState<any>(null); 
  const [error, setError] = useState<string | null>(null); 

  const fetchRecommendations = async () => {
    if (!query.trim()) {
      setError("Please enter a book title."); 
      return;
    }

    setError(null); 
    setLoading(true); 

    try {
      const res = await fetch(`/api/recommend?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (res.ok) {
        setRecommendations(data); 
      } else {
        setError(data.error || "Something went wrong."); 
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recommendations."); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Find Movies Based on Your Favorite Book</h1>
      <p>Enter a book title, and we'll recommend movies for you!</p>

      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Enter a book title..."
          style={{
            padding: "0.5rem",
            width: "100%",
            maxWidth: "400px",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={fetchRecommendations}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>} 

      {error && <p style={{ color: "red" }}>{error}</p>} 

      {recommendations && (
        <div>
          <h2>Book: {recommendations.book}</h2> 
          <h3>Recommended Movies:</h3>
          <ul>
            {recommendations.recommendations.map((rec: any, idx: number) => (
              <li key={idx}>
                {rec.movie} (Score: {rec.score.toFixed(2)}) 
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}