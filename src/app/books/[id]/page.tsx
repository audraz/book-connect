"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function BookDetail() {
  const params = useParams();  // This captures the `id` from the URL
  const router = useRouter();
  const [bookDetail, setBookDetail] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        if (!params || !params.id) {
          setError("Book ID is missing.");
          setLoading(false);
          return;
        }

        const bookId = Array.isArray(params.id) ? params.id[0] : params.id;
        const decodedId = decodeURIComponent(bookId);

        const res = await fetch(`/api/search-books?query=${encodeURIComponent(decodedId)}`);
        const data = await res.json();

        if (res.ok && data.length > 0) {
          setBookDetail(data[0]);
          setError(null);
        } else {
          setError("No book details found.");
        }
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to fetch book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [params]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>{bookDetail.title}</h1>
      <p><strong>Author:</strong> {bookDetail.author}</p>
      {bookDetail.coverUrl ? (
        <img
          src={bookDetail.coverUrl}
          alt={bookDetail.title}
          style={{ width: "200px", height: "auto", marginBottom: "20px" }}
        />
      ) : (
        <img
          src="/placeholder-cover.png"
          alt="No Cover Available"
          style={{ width: "200px", height: "auto", marginBottom: "20px" }}
        />
      )}
      <p><strong>Description:</strong> {bookDetail.description}</p>

      {/* Button "Read Now" */}
      <button
  onClick={() => {
    // Simpan data buku yang dipilih
    const bookData = {
      title: bookDetail.title,
      author: bookDetail.author,
      description: bookDetail.description,
      coverUrl: bookDetail.coverUrl || '/placeholder-cover.png',
      progress: 0, // Progress dimulai dari 0
      startDate: new Date().toLocaleDateString(), // Tanggal mulai membaca
    };

    // Simpan data ke localStorage atau state
    localStorage.setItem('currentBook', JSON.stringify(bookData));

    // Redirect ke homepage
    router.push('/homepage');
  }}
  style={{
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#0070f3",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  }}
>
  Read Now
</button>
    </div>
  );
}