"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import styles from "./Signup.module.css";

const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] });

export default function Signup() {
  const router = useRouter();
  const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = (document.getElementById("name") as HTMLInputElement)?.value.trim();
    const email = (document.getElementById("email") as HTMLInputElement)?.value.trim();
    const password = (document.getElementById("password") as HTMLInputElement)?.value;
    const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement)?.value;

    if (!name || !email || !password || !confirmPassword) {
      setAlert({ message: "All fields are required!", type: "error" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({ message: "Please enter a valid email address!", type: "error" });
      return;
    }

    if (password.length < 6) {
      setAlert({ message: "Password must be at least 6 characters long!", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ message: "Passwords do not match!", type: "error" });
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAlert({ message: errorData.error || "Signup failed. Please try again.", type: "error" });
        return;
      }

      setAlert({ message: "Signup successful! Please log in to your account...", type: "success" });
      setTimeout(() => router.push("/homepage"), 2000); 
    } catch (error) {
      console.error("Signup error:", error);
      setAlert({ message: "An unexpected error occurred. Please try again.", type: "error" });
    }
  };

  return (
    <div className={`${styles.container} ${poppins.className}`}>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome to BookConnect!</h1>
        <p className={styles.welcomeMessage}>
          Discover a world of books, movies, and podcasts curated just for you.
        </p>
      </div>
      <div className={styles.signupSection}>
        <header className={styles.header}>
          <h1>Create Your Account</h1>
        </header>
        <main className={styles.main}>
          <form className={styles.form} onSubmit={handleSignup}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" required placeholder="Your Name" />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" required placeholder="Your Email" />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" required placeholder="Your Password" />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              required
              placeholder="Confirm Your Password"
            />

            <button type="submit" className={styles.button}>
              Sign Up
            </button>
          </form>
          <p className={styles.loginPrompt}>
            Already have an account?{" "}
            <span
              className={styles.loginLink}
              onClick={() => router.push("/login")}
            >
              Log In
            </span>
          </p>
        </main>
      </div>

      {alert && (
        <div
          className={`${styles.alert} ${alert.type === "success" ? styles.success : styles.error}`}
        >
          {alert.message}
        </div>
      )}
    </div>
  );
}