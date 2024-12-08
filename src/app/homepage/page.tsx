"use client";

import styles from "./Homepage.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Homepage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    alert("You have been logged out.");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        WELCOME, {session.user.name.toUpperCase()}!
      </div>

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="BookConnect Logo" width={150} height={50} />
        </div>

        <div className={styles.navbarCenter}>
          <button className={styles.navButton} onClick={() => router.push("/")}>
            Home
          </button>
          <button
            className={styles.navButton}
            onClick={() => router.push("/profile")}
          >
            Profile
          </button>
          <button
            className={styles.navButton}
            onClick={() => router.push("/about")}
          >
            About
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
          <div className={styles.card}>
            <Image
              src="/read-book.png"
              alt="Read Book"
              width={100}
              height={100}
              className={styles.cardImage}
            />
            <h3>You haven’t read any book!</h3>
            <p>Let’s start your reading journey now!</p>
            <button
              className={styles.cardButton}
              onClick={() => router.push("/choose-book")}
            >
              Choose a Book
            </button>
          </div>
          <div className={styles.card}>
            <Image
              src="/film.png"
              alt="Chapter to Screen"
              width={100}
              height={100}
              className={styles.cardImage}
            />
            <h3>Chapter To Screen</h3>
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
    </div>
  );
}