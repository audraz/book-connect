"use client";

import styles from "./Homepage.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Homepage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userBooks, setUserBooks] = useState<any[]>([]);
  const [progress, setProgress] = useState<number>(0);

  // Redirect jika tidak login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.email) {
      // Ambil buku user dari database
      fetch(`/api/user-books?user_id=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => setUserBooks(data))
        .catch((err) => console.error("Failed to fetch books:", err));
    }
  }, [status, session, router]);

  // Fungsi Logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    alert("You have been logged out.");
    router.push("/login");
  };

  // Update progress bacaan
  const updateProgress = async (bookName: string) => {
    const response = await fetch("/api/user-books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: session?.user?.email,
        book_name: bookName,
        progress: progress,
      }),
    });
    if (response.ok) {
      alert("Progress updated!");
      location.reload();
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        Hi, {session.user?.name || "User"}!
      </div>

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo.png"
            alt="BookConnect Logo"
            width={150}
            height={50}
          />
        </div>

        <div className={styles.navbarCenter}>
          <button
            className={styles.navButton}
            onClick={() => router.push("/")}
          >
            Home
          </button>
          <button
            className={styles.navButton}
            onClick={() => router.push("/profile")}
          >
            Profile
          </button>
        </div>

        <div className={styles.navLogin}>
          <button
            className={`${styles.navButton} ${styles.logout}`}
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </header>

      <div className={styles.welcomeContainer}>
        <h2 className={styles.welcome}>Welcome :)</h2>
        <p className={styles.subtitle}>What book did you read today?</p>
      </div>

      <main className={styles.main}>
        <div className={styles.cards}>
          {userBooks.length > 0 ? (
            userBooks.map((book) => (
              <div className={styles.card} key={book.id}>
                <h3>{book.book_name}</h3>
                <p>Author: {book.author}</p>
                <p>Progress: {book.progress}%</p>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  style={{ margin: "10px 0" }}
                />
                <button
                  className={styles.cardButton}
                  onClick={() => updateProgress(book.book_name)}
                >
                  Update Progress
                </button>
              </div>
            ))
          ) : (
            <div className={styles.card}>
              <h3>You haven’t read any book!</h3>
              <Image
                src="/read-book.png"
                alt="Read Book"
                width={100}
                height={100}
                className={styles.cardImage}
              />
              <p>Let’s start your reading journey now!</p>
              <button
                className={styles.cardButton}
                onClick={() => router.push("/choose-book")}
              >
                Choose a Book
              </button>
            </div>
          )}

          <div className={styles.card}>
            <h3>Chapter To Screen</h3>
            <Image
              src="/film.png"
              alt="Chapter to Screen"
              width={100}
              height={100}
              className={styles.cardImage}
            />
            <p>
              Suggest films, series, and podcasts to enhance your reading
              experience through other entertainment formats.
            </p>
            <button
              className={styles.cardButton}
              onClick={() => router.push("/chapter-to-screen")}
            >
              Start Now
            </button>
          </div>
        </div>
      </main>

      <div className={styles.waveContainer}>
        <Image
          src="/wave.png"
          alt="Wave Background"
          width={1920}
          height={200}
          className={styles.wave}
        />
      </div>
    </div>
  );
}