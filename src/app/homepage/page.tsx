"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { signOut } from "next-auth/react";
import styles from "./Homepage.module.css";

export default function Homepage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userBooks, setUserBooks] = useState<any[]>([]);
  const [currentBook, setCurrentBook] = useState<any>(null); // Track current book
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.email) {
      fetch(`/api/user-books?user_id=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => setUserBooks(data))
        .catch((err) => console.error("Failed to fetch books:", err));
    }

    const storedBook = localStorage.getItem('currentBook');
    if (storedBook) {
      setCurrentBook(JSON.parse(storedBook));
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
          {currentBook ? (
            <div className={styles.card} key={currentBook.title}>
              <h3>{currentBook.title}</h3>
              <p>Author: {currentBook.author}</p>
              <p>Progress: {currentBook.progress}%</p>
              <Image
                src={currentBook.coverUrl || "/placeholder-cover.png"}
                alt={currentBook.title}
                width={100}
                height={150}
                className={styles.cardImage}
              />
              <div className={styles.progressBar}>
                <div
                  style={{
                    width: `${currentBook.progress}%`,
                    height: "10px",
                    backgroundColor: "#0070f3",
                  }}
                />
              </div>
              <button
                className={styles.cardButton}
                onClick={() => updateProgress(currentBook.title)}
              >
                Update Progress
              </button>
            </div>
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