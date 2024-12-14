"use client";

import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./styles/Home.module.css";

export default function Home() {
  const router = useRouter();

  const scrollToGreenSection = () => {
    const greenSection = document.getElementById("greenSection");
    if (greenSection) {
      greenSection.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error("Element with ID 'greenSection' not found.");
    }
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const handleSignupRedirect = () => {
    router.push("/signup");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>BookConnect</title>
        <meta name="description" content="Your reading journey expanded" />
        <link rel="icon" href="/logo.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.topBar}>
        SIGN UP OR LOG IN TO START YOUR JOURNEY
      </div>

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="BookConnect Logo" width={150} height={50} />
        </div>

        <nav className={styles.navbarCenter}>
          <button className={styles.navButton} onClick={scrollToGreenSection}>
            About
          </button>
        </nav>

        <div className={styles.navLogin}>
          <button className={styles.navButton} onClick={handleLoginRedirect}>
            Log In
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroImage}>

            <Image src="/book.png" alt="Books" width={500} height={400} />
          </div>
          <div className={styles.heroContent}>

            <Image
              src="/slogan.png"
              alt="Your Reading Journey Expanded"
              width={328}
              height={189}
            />

            <button className={styles.ctaButton} onClick={handleSignupRedirect}>
              Get Started
            </button>
          </div>
        </section>

        <section className={styles.greenSection} id="greenSection">
          <div className={styles.greenContent}>
            <h2>beyond the page</h2>
            <p>
              Welcome to your ultimate companion for all things reading and
              beyond! Whether you're an avid bookworm or just starting your
              reading journey, we're here to make your experience more exciting
              and personal.
            </p>
            <p>
              With BookConnect, you can easily track your reading progress—know
              exactly how far you've gone in your favorite books and stay
              motivated to finish them. Not sure what to read next? Don't worry!
              After finishing a book, we'll ask a few fun questions to recommend
              your next great read, perfectly tailored to your taste.
            </p>
            <p>
              But that's not all! BookConnect takes your love for stories to the
              next level by connecting you with movies, TV shows, and podcasts
              inspired by the books you've read. Discover how your favorite
              stories live on in other media and dive deeper into the worlds you
              love.
            </p>
          </div>
          <div className={styles.greenImage}>
            <Image
              src="/book-stack.png"
              alt="Stack of Books"
              width={400}
              height={300}
            />
          </div>
        </section>
      </main>
    </div>
  );
}