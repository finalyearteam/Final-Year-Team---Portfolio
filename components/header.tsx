"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css"; 

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Function to close the mobile menu when a link is clicked
  const closeMenu = () => setIsMobileOpen(false);

  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.glassNav}>
        
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <img 
            src="fytlogo.jpeg" 
            alt="GCOERC Project Hub Logo" 
            className={styles.logoImage} 
          />
        </Link>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className={styles.desktopMenu}>
          <Link href="#home" className={styles.navLink}>Home</Link>
          <Link href="#about" className={styles.navLink}>About</Link>
          <Link href="#team" className={styles.navLink}>Team</Link>
          <Link href="#contact" className={styles.navLink}>Contact</Link>
          <Link href="/dashboard" className={styles.dashboardBtn}>
            Dashboard
          </Link>
        </div>

        {/* Mobile Menu Button (Hidden on Desktop) */}
        <button 
          className={styles.hamburger}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? (
            /* Close 'X' Icon - Deep Violet (#4a044e) */
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4a044e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            /* Hamburger Icon - Deep Violet (#4a044e) */
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4a044e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Mobile Dropdown (Visible only when button is clicked on Mobile) */}
        {isMobileOpen && (
          <div className={styles.mobileMenu}>
            <Link href="#home" className={styles.navLink} onClick={closeMenu}>Home</Link>
            <Link href="#about" className={styles.navLink} onClick={closeMenu}>About</Link>
            <Link href="#team" className={styles.navLink} onClick={closeMenu}>Team</Link>
            <Link href="#contact" className={styles.navLink} onClick={closeMenu}>Contact</Link>
            <Link href="/dashboard" className={styles.dashboardBtn} onClick={closeMenu}>
              Dashboard
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}