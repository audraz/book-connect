"use client";

import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import styles from "./Signup.module.css";

const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] });

export default function Signup() {
  const router = useRouter();

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();

    const name = (document.getElementById("name") as HTMLInputElement)?.value.trim();
    const email = (document.getElementById("email") as HTMLInputElement)?.value.trim();
    const password = (document.getElementById("password") as HTMLInputElement)?.value;
    const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement)?.value;

    if (!name || !email || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const userExists = users.find((user: { email: string }) => user.email === email);
    if (userExists) {
      alert("Email is already registered. Please log in or use another email.");
      return;
    }

    const newUser = {
      id: new Date().getTime().toString(), 
      name,
      email,
      password,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    console.log("New user registered:", newUser); 

    alert("Signup successful! Redirecting to homepage...");
    router.push("/homepage");
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
    </div>
  );
}