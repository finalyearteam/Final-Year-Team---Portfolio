import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glassContainer}>
        
        <div className={styles.topSection}>
          
          {/* Column 1: Brand & Mission */}
          <div className={styles.brandColumn}>
            <h3 className={styles.logoText}>Final Year Team</h3>
            <p className={styles.description}>
              Showcasing innovation, academic excellence, and collaborative development. 
              A dedicated digital space for our final year engineering project.
            </p>
            <div className={styles.socialRow}>
              {/* You can replace these text abbreviations with actual SVG icons later */}
              <a href="https://github.com/finalyearteam" target="_blank" rel="noreferrer" className={styles.socialIcon}>GH</a>
              <a href="https://www.linkedin.com/in/final-year-team-377928422/" target="_blank" rel="noreferrer" className={styles.socialIcon}>IN</a>
              <a href="https://www.youtube.com/@finalyearteam" target="_blank" rel="noreferrer" className={styles.socialIcon}>YT</a>
              <a href="https://www.instagram.com/final_year_team/" target="_blank" rel="noreferrer" className={styles.socialIcon}>IG</a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Navigation</h4>
            <nav className={styles.navLinks}>
              <a href="/">Home</a>
              <a href="#about">The Project</a>
              <a href="#team">Meet The Team</a>
              <a href="#contact">Contact Us</a>
              <a href="dashboard">Dashboard</a>
            </nav>
          </div>

          {/* Column 3: Project Info */}
          <div className={styles.infoColumn}>
            <h4 className={styles.columnTitle}>Academic Details</h4>
            <ul className={styles.infoList}>
              <li><strong>Institution:</strong> GCOERC, Nashik</li>
              <li><strong>Affiliation:</strong> SPPU</li>
              <li><strong>Mentor:</strong> Prof. Swati Khokhale</li>
              <li><strong>Tech Stack:</strong> MERN Stack</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomSection}>
          <div className={styles.divider}></div>
          <div className={styles.copyrightRow}>
            <p>&copy; {new Date().getFullYear()} Final Year Team. All rights reserved.</p>
            <p className={styles.madeWith}>Designed with ✨ in Nashik</p>
          </div>
        </div>
        
      </div>
    </footer>
  );
}