"use client";

import Link from "next/link";
import styles from "./Home.module.css"; 

export default function Home() {
  return (
    <main className={styles.mainContainer}>
      
      {/* Ambient Background Glows */}
      <div className={styles.ambientGlow1}></div>
      <div className={styles.ambientGlow2}></div>

      <section className={styles.heroSection}>
        
        {/* Left Side: Text and Information */}
        <div className={styles.textContent}>
          <div className={styles.badge}>✨ Project Hub v1.0</div>
          <h1 className={styles.title}>Final Year Team</h1>
          
          {/* Changed to a 2x2 Grid on Desktop to fill space */}
          <div className={styles.descriptionGrid}>
            <div className={styles.descriptionItem}>
              <span className={styles.icon}>🚀</span> 
              <span>Engineering Project Team</span>
            </div>
            <div className={styles.descriptionItem}>
              <span className={styles.icon}>💡</span> 
              <span>AI-Powered Solutions</span>
            </div>
            <div className={styles.descriptionItem}>
              <span className={styles.icon}>👨‍💻</span> 
              <span>Code • Build • Innovate</span>
            </div>
            <div className={styles.descriptionItem}>
              <span className={styles.icon}>📍</span> 
              <span>India</span>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <Link href="/dashboard" className={styles.primaryBtn}>
              Enter Workspace
            </Link>
          </div>
        </div>

        {/* Right Side: Floating Glass Logo Card */}
        <div className={styles.visualContent}>
          <div className={styles.glassCard}>
            <img 
              src="/fytlogo.jpeg" 
              alt="Final Year Team Logo" 
              className={styles.logoImage} 
            />
          </div>
        </div>
      </section>

      {/* NEW: Floating Tech Stack Banner to anchor the bottom of the page */}
      <div className={styles.techBannerWrapper}>
        <div className={styles.techBanner}>
          <span className={styles.techItem}>Powered by Next.js</span>
          <span className={styles.techDot}>•</span>
          <span className={styles.techItem}>Real-time Collaboration</span>
          <span className={styles.techDot}>•</span>
          <span className={styles.techItem}>Integrated AI Assistant</span>
        </div>
      </div>

    </main>
  );
}