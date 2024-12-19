"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./Profile.module.css"; 

export default function Profile() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [name, setName] = useState(session?.user?.name || ""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (status === "loading") {
    return <p>Loading...</p>; 
  }

  if (!session) {
    return <p>Please log in to view this page.</p>; 
  }

  const handleSaveChanges = async () => {
    if (!name && !password) {
      setError("Please enter at least a new name or password");
      return;
    }

    try {
      const response = await fetch("/api/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          name: name || undefined,
          password: password || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setError("");  

        if (name) {
          update({
            user: {
              ...session.user,
              name: name, 
            },
          });
        }
      } else {
        setError(data.error || "Something went wrong");
        setSuccess(""); 
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
      setSuccess(""); 
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>Hi, {session?.user?.name || "User"}!</div>

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo" width={150} height={50} />
        </div>
        <div className={styles.navbarCenter}>
          <button onClick={() => router.push("/homepage")} className={styles.navButton}>
            Home
          </button>
          <button onClick={() => router.push("/profile")} className={styles.navButton}>
            Profile
          </button>
        </div>
        <div className={styles.navLogin}>
          <button onClick={() => router.push("/api/auth/signout")} className={styles.navButton}>
            Log Out
          </button>
        </div>
      </header>

      <div className={styles.profileContainer}>
        <h1 className={styles.h1}>Profile Settings</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.profileInfo}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={session?.user?.email || ""}
              disabled
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={session?.user?.name || "User"} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <button className={styles.saveButton} onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
