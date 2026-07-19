"use client";

import styles from "./Team.module.css";

export default function Team() {
  return (
    <section id="team" className={styles.teamSection}>
      {/* Background Orbs for Glass Effect */}
      <div className={styles.ambientGlow1}></div>
      <div className={styles.ambientGlow2}></div>

      <div className={styles.headerContent}>
        <h2 className={styles.sectionTitle}>Meet The Team</h2>
        <p className={styles.sectionSubtitle}>
          Guided by experience. Driven by innovation.
        </p>
      </div>

      {/* --- Tier 1: Teacher Guide (No Photo) --- */}
      <div className={styles.mentorContainer}>
        <div className={styles.mentorCard}>
          <div className={styles.roleBadge}>Teacher Guide</div>
          <h3 className={styles.mentorName}>Prof. Swati Khokhale</h3>
          <p className={styles.mentorCredentials}>
            PhD Scholar (CSE) | ME (Computer Engg.)
          </p>
          <p className={styles.mentorSkills}>
            Machine Learning • Cybersecurity • Data Analytics • Python • SQL • Java
          </p>
          
          <div className={styles.mentorBio}>
            <p>
              Assistant Professor at Guru Gobind Singh College of Engineering and Research Centre, Nashik, with 14+ years of academic experience. Passionate about Outcome-Based Education, AI-driven teaching, and research-led learning.
            </p>
            <ul className={styles.mentorHighlights}>
              <li>🔬 40+ research publications (journals & conferences)</li>
              <li>🎯 FDP Cell Coordinator & Coordinator for cPGCON 2017 / IEEE Bombay Section Congress 2019</li>
              <li>🏆 Best Tutor Award (2017) – SITRC</li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- Tier 2: The Core Team Grid (No Photos) --- */}
      <div className={styles.teamGrid}>
        
        {/* Team Leader: Sumit */}
        <div className={`${styles.memberCard} ${styles.leaderCard}`}>
          <div className={styles.memberHeader}>
            <div className={styles.leaderBadge}>Team Leader</div>
            <h3 className={styles.memberName}>Sumit Lasulkar</h3>
          </div>
          <p className={styles.memberBio}>
            Coding & AI Teacher at Edugenius Softwares LLP. Founder of ThinkHatch Educational Platform, mentoring 3,000+ learners. Full-Stack Developer Intern at Nexonica System Pvt. Ltd. 
          </p>
          <div className={styles.memberTags}>
            <span>Software Developer</span>
            <span>AI Engineer</span>
          </div>
        </div>

        {/* Member: Anagha */}
        <div className={styles.memberCard}>
          <div className={styles.memberHeader}>
            <div className={styles.memberBadge}>Core Member</div>
            <h3 className={styles.memberName}>Anagha Kaloge</h3>
          </div>
          <p className={styles.memberBio}>
            Computer Engineering Student ’27 focused on Deep Learning & AI. Currently pursuing a 45-Day AI/ML OJT at AI Leela. Building real projects with Python, Flask, and full-stack deployment. Open to SDE/AI-ML internships starting Feb 2026.
          </p>
          <div className={styles.memberTags}>
            <span>Deep Learning</span>
            <span>Java DSA</span>
            <span>Web Dev</span>
          </div>
        </div>

        {/* Member: Om */}
        <div className={styles.memberCard}>
          <div className={styles.memberHeader}>
            <div className={styles.memberBadge}>Core Member</div>
            <h3 className={styles.memberName}>Om Mandlik</h3>
          </div>
          <p className={styles.memberBio}>
            Data Science Intern at Skyminds Solutions. Specializing in Artificial Intelligence and Software Development. Has successfully built and deployed 6+ projects focused on data science and scalable web development.
          </p>
          <div className={styles.memberTags}>
            <span>Data Science</span>
            <span>Web Dev</span>
            <span>AI</span>
          </div>
        </div>

        {/* Member: Snehal */}
        <div className={styles.memberCard}>
          <div className={styles.memberHeader}>
            <div className={styles.memberBadge}>Core Member</div>
            <h3 className={styles.memberName}>Snehal Lashkar</h3>
          </div>
          <p className={styles.memberBio}>
            Computer Engineering Student ’27 with a strong passion for Software Engineering and UI/UX Integration. Focused on mastering Data Structures with Java and building scalable, responsive web solutions. Aiming to build a robust portfolio of enterprise-level projects. Open to SDE internships.
          </p>
          <div className={styles.memberTags}>
            <span>Software Engg</span>
            <span>Java DSA</span>
            <span>UI/UX</span>
          </div>
        </div>

      </div>
    </section>
  );
}