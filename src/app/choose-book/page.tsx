"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChooseBook() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.trim()) {
      const fetchBooks = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/search-books?query=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (res.ok) {
            setResults(data);
            setError(null);
          } else {
            setResults([]);
            setError(data.error || "No books found.");
          }
        } catch (err) {
          console.error(err);
          setError("Failed to fetch books.");
        } finally {
          setLoading(false);
        }
      };
      fetchBooks();
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Search for a Book</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing a book title..."
        style={{
          padding: "0.5rem",
          width: "100%",
          marginBottom: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <ul
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            listStyle: "none",
            padding: "0",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {results.map((book) => (
            <li
              key={book.isbn || book.title}
              onClick={() => router.push(`/books/${encodeURIComponent(book.isbn || book.title)}`)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {book.coverUrl && (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  style={{ width: "40px", height: "60px", marginRight: "1rem" }}
                />
              )}
              <div>
                <strong>{book.title}</strong>
                <p style={{ margin: "0", fontSize: "0.8rem", color: "#555" }}>
                  {book.author}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}