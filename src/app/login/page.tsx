"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import styles from "./Login.module.css";

const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] });

export default function Login() {
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        users: JSON.stringify(users), 
        redirect: false,
      });

      console.log("Login result:", result);

      if (result?.error) {
        alert("Invalid email or password. Please try again.");
        return;
      }

      alert("Login successful! Redirecting to homepage...");
      router.push("/homepage");
    } catch (error) {
      console.error("Error during login:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className={`${styles.container} ${poppins.className}`}>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome Back</h1>
        <p className={styles.welcomeMessage}>
          We're glad to see you again! Please log in to continue.
        </p>
      </div>

      <div className={styles.signupSection}>
        <h1>Log In</h1>
        <main className={styles.main}>
          <form className={styles.form} onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />

            <button type="submit" className={styles.button}>Log In</button>
          </form>
          <p className={styles.signupPrompt}>
            Don't have an account?{" "}
            <span className={styles.signupLink} onClick={() => router.push("/signup")}>
              Sign up here
            </span>
          </p>
        </main>
      </div>
    </div>
  );
}