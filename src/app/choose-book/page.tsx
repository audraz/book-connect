"use client";

import { useState } from "react";

export default function ChooseBook() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [books, setBooks] = useState<any[]>([]);

  const fetchBooks = async () => {
    if (!searchQuery) return; 
    const response = await fetch(`/api/books?query=${searchQuery}`);
    const data = await response.json();
    setBooks(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Choose a Book</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search for a book title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
            width: "300px",
          }}
        />
        <button
          onClick={fetchBooks}
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#E5839A",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Search
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: "0" }}>
        {books.length > 0 ? (
          books.map((book, index) => (
            <li
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <h3>{book.name}</h3>
              <p>Author: {book.authors}</p>
              <p>Year: {book.year}</p>
            </li>
          ))
        ) : (
          <p>No books found. Try searching for another title!</p>
        )}
      </ul>
    </div>
  );
}