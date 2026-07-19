"use client";

import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.aboutSection}>
      
      {/* Section Header */}
      <div className={styles.headerContent}>
        <h2 className={styles.sectionTitle}>Who We Are</h2>
        <p className={styles.sectionSubtitle}>
          Four minds. One vision. Building the future of AI and Software Development.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className={styles.bentoGrid}>
        
        {/* Card 1: The Journey */}
        <div className={`${styles.glassCard} ${styles.journeyCard}`}>
          <h3 className={styles.cardTitle}>The Journey</h3>
          <p className={styles.cardText}>
            Our final year journey officially began on <strong>July 21st</strong>. 
            As the <strong>Batch of 2026-27</strong>, we stepped into our fourth year embracing the unknown. 
            We may not have had every step mapped out on day one, but we are driven by a shared passion to 
            code, innovate, and conquer challenges as they come.
          </p>
          <div className={styles.domainTags}>
            <span className={styles.tag}>Software Development</span>
            <span className={styles.tag}>Artificial Intelligence</span>
            <span className={styles.tag}>Core Computer Science</span>
          </div>
        </div>

        {/* Card 2: The Mentors & Institution */}
        <div className={`${styles.glassCard} ${styles.academicCard}`}>
          <div className={styles.logos}>
            {/* SPPU Logo Placeholder */}
            <img src="sppu-logo.jpg" alt="SPPU Logo" className={styles.uniLogo} />
            {/* GCOERC Logo Placeholder */}
            <img src="gcoerc.jpg" alt="GCOERC Logo" className={styles.uniLogo} />
          </div>
          <h3 className={styles.cardTitle}>Our Foundation</h3>
          <p className={styles.institutionText}>
            <strong>Savitribai Phule Pune University (SPPU)</strong><br />
            Guru Gobind Singh College of Engineering and Research Centre (GCOERC)
          </p>
          <div className={styles.mentorsList}>
            <div className={styles.mentorItem}>
              <span className={styles.role}>Principal:</span> 
              <span className={styles.name}>Dr. Nilkanth Nikam</span>
            </div>
            <div className={styles.mentorItem}>
              <span className={styles.role}>HOD (Computer):</span> 
              <span className={styles.name}>Prof. Nita Thakre</span>
            </div>
            <div className={styles.mentorItem}>
              <span className={styles.role}>Project Guide:</span> 
              <span className={styles.name}>Prof. Swati Khokhale</span>
            </div>
          </div>
        </div>

        {/* Card 3: The Squad */}
        <div className={`${styles.glassCard} ${styles.teamCard}`}>
          <h3 className={styles.cardTitle}>The Squad</h3>
          <div className={styles.teamList}>
            <div className={styles.teamLeader}>
              <div className={styles.leaderBadge}>Team Leader</div>
              <h4 className={styles.memberName}>Sumit Lasulkar</h4>
            </div>
            <div className={styles.membersWrapper}>
              <div className={styles.member}>
                <h4 className={styles.memberName}>Anagha Kaloge</h4>
                <p className={styles.memberRole}>Core Member</p>
              </div>
              <div className={styles.member}>
                <h4 className={styles.memberName}>Om Mandlik</h4>
                <p className={styles.memberRole}>Core Member</p>
              </div>
              <div className={styles.member}>
                <h4 className={styles.memberName}>Snehal Lashkar</h4>
                <p className={styles.memberRole}>Core Member</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}