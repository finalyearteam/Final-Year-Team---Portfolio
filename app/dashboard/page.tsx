"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
// 🔴 UNCOMMENT THESE WHEN YOUR FIREBASE IS READY:
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig";

export default function ProjectHub() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- FIREBASE PASSWORD CHECK ---
  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 🟡 TEMPORARY DUMMY LOGIC (Remove when Firebase is connected)
      if (password === "sumit123") {
        setIsAuthenticated(true);
      } else {
        setError("Incorrect team access code.");
      }
    } catch (err) {
      setError("Error connecting to database.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 1. LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
        <>
    <Header />
      <div className={styles.pageWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.badgeWrapper}>
            <span className={styles.versionBadge}>✨ Project Hub v1.0</span>
          </div>
          <h1 className={styles.loginTitle}>Team Workspace</h1>
          <p className={styles.loginSub}>Secure access required for team members.</p>
          
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Access Code" 
                className={styles.loginInput}
                required
              />
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
            <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </div>
        <Footer />
      </>
    );
  }

  // --- 2. HUB MENU (Cards) ---
  return (
    <>
    <Header />
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* Floating Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.versionBadge}>✨ Project Hub v1.0</span>
            <h1 className={styles.title}>Final Year Team </h1>
          </div>
          <div className={styles.headerRight}>
            <button onClick={() => setIsAuthenticated(false)} className={styles.logoutBtn}>
              🔒 Lock Workspace
            </button>
          </div>
        </header>

        {/* Responsive Grid */}
        <div className={styles.grid}>
          
          <Link href="notice-board" className={`${styles.menuCard} ${styles.delay1}`}>
            <div className={styles.iconWrapper}>📌</div>
            <div className={styles.cardContent}>
              <h2 className={styles.menuTitle}>Notice Board</h2>
              <p className={styles.menuDesc}>View important team announcements, deadlines, and project updates.</p>
            </div>
          </Link>

          <Link href="/dashboard/leave-board" className={`${styles.menuCard} ${styles.delay2}`}>
            <div className={styles.iconWrapper}>🗓️</div>
            <div className={styles.cardContent}>
              <h2 className={styles.menuTitle}>Leave Board</h2>
              <p className={styles.menuDesc}>Track team availability, active leaves, and upcoming holidays.</p>
            </div>
          </Link>

          <Link href="/dashboard/penalty-board" className={`${styles.menuCard} ${styles.delay3}`}>
            <div className={styles.iconWrapper}>⚠️</div>
            <div className={styles.cardContent}>
              <h2 className={styles.menuTitle}>Penalty Board</h2>
              <p className={styles.menuDesc}>Review missed deadlines, code review failures, or rule infractions.</p>
            </div>
          </Link>

          <Link href="/dashboard/presentation-board" className={`${styles.menuCard} ${styles.delay4}`}>
            <div className={styles.iconWrapper}>📊</div>
            <div className={styles.cardContent}>
              <h2 className={styles.menuTitle}>Presentation Board</h2>
              <p className={styles.menuDesc}>Manage slides, project reports, architecture diagrams, and drafts.</p>
            </div>
          </Link>

          <Link href="/dashboard/chat" className={`${styles.menuCard} ${styles.delay5}`}>
            <div className={styles.iconWrapper}>💬</div>
            <div className={styles.cardContent}>
              <h2 className={styles.menuTitle}>Chat Section</h2>
              <p className={styles.menuDesc}>Communicate securely, drop quick links, and collaborate in real-time.</p>
            </div>
          </Link>

          <Link href="/dashboard/tasks" className={`${styles.menuCard} ${styles.delay6}`}>
            <div className={styles.iconWrapper}>✅</div>
            <div className={styles.cardContent}>
              <h2 className={styles.menuTitle}>Task Board</h2>
              <p className={styles.menuDesc}>Assign, track, and complete engineering modules and assignments.</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}