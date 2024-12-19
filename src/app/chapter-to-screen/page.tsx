"use client";

import { useState } from "react";
import styles from "./CTS.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function ChapterToScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

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
        setRecommendations(data.recommendations);
        setShowPopup(true);
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

  const handleNext = () => {
    const content = document.querySelector(`.${styles.carouselContent}`);
    if (content) {
      content.classList.add(styles["fade-out"]); 
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendations.length);
        content.classList.remove(styles["fade-out"]); 
        content.classList.add(styles["fade-in"]); 
        setTimeout(() => content.classList.remove(styles["fade-in"]), 500); 
      }, 500); 
    }
  };

  const handlePrev = () => {
  const content = document.querySelector(`.${styles.carouselContent}`);
  if (content) {
    content.classList.add(styles["fade-out"]);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
      );
      content.classList.remove(styles["fade-out"]);
      content.classList.add(styles["fade-in"]);
      setTimeout(() => content.classList.remove(styles["fade-in"]), 500);
    }, 500);
  }
};

  const handleLogout = async () => {
    await signOut({ redirect: false });
    alert("You have been logged out.");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        Hi, {session?.user?.name || "User"}!
      </div>

      <h1 className={styles.title}>Find Movies Based on Your Favorite Book</h1>
      <p className={styles.subtitle}>Enter a book title, and we'll recommend movies for you!</p>

      <div className={styles.inputContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a book title..."
          className={styles.inputField}
        />
        <button onClick={fetchRecommendations} className={styles.searchButton}>
          Search Movies
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {showPopup && recommendations.length > 0 && (
        <>
          <div className={styles.popupBackdrop} onClick={() => setShowPopup(false)}></div>
          <div className={styles.popup}>
  <div className={styles.fixedContent}>
    <h2 className={styles.popupTitle}>Movie Recommendations</h2>
    <div className={styles.carousel}>
      <button className={styles.navButton} onClick={handlePrev}>◀</button>
      <div className={styles.carouselContent}>
        <img src={recommendations[currentIndex]?.posterUrl || "/placeholder-poster.png"} alt={recommendations[currentIndex]?.movie} className={styles.poster} />
        <div className={styles.movieInfo}>
          <h3>{recommendations[currentIndex]?.movie}</h3>
          <p><strong>Score:</strong> {recommendations[currentIndex]?.score.toFixed(2)}</p>
        </div>
      </div>
      <button className={styles.navButton} onClick={handleNext}>▶</button>
    </div>
    <button className={styles.closeButton} onClick={() => setShowPopup(false)}>Close</button>
  </div>
  <div className={styles.descriptionContainer}>
    <p className={styles.description}>{recommendations[currentIndex]?.description || "No description available"}</p>
  </div>
</div>
        </>
      )}

      <div className={styles.waveContainer}>
        <img src="/wave.png" alt="Wave Background" className={styles.wave} />
      </div>
    </div>
  );
}