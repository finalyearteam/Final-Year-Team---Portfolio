'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Topicselection.module.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function TopicSelectionPage() {
  return (
    <div className={styles.pageContainer}>
      {/* Sticky Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>GROUP 17 PORTFOLIO</div>
        <div className={styles.navLinks}>
          <a href="#topic1" className={styles.navLink}>Cyber Defence</a>
          <a href="#topic2" className={styles.navLink}>AI Career Engine</a>
          <a href="#architectures" className={styles.navLink}>Architectures</a>
          <a href="#research" className={styles.navLink}>Research Context</a>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.header 
        className={styles.heroSection}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className={styles.badge}>
          Academic Year 2025 – 2026 | Final Year Engineering Showcase
        </motion.div>
        
        <motion.h1 variants={fadeInUp} className={styles.heroTitle}>
          Agentic AI & Cybersecurity Ecosystems
        </motion.h1>
        
        <motion.p variants={fadeInUp} className={styles.heroSubtitle}>
          Project Proposals & System Blueprint Portfolio for Panel Selection
        </motion.p>

        <motion.div variants={fadeInUp} className={styles.metaGrid}>
          <div className={styles.metaCard}>
            Group: <strong>Group 17</strong>
          </div>
          <div className={styles.metaCard}>
            Lead: <strong>Sumit Lasulkar</strong>
          </div>
          <div className={styles.metaCard}>
            Team: <strong>Anagha Kaloge, Om Mandlik, Snehal Lashkar</strong>
          </div>
          <div className={styles.metaCard}>
            Guide: <strong>Prof. Swati Khokhale</strong>
          </div>
          <div className={styles.metaCard}>
            Institute: <strong>GCOERC Nashik</strong>
          </div>
        </motion.div>
      </motion.header>

      {/* Main Content Area */}
      <main className={styles.contentWrapper}>

        {/* ==================== TOPIC 1 ==================== */}
        <motion.section 
          id="topic1" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ marginBottom: '6rem' }}
        >
          <motion.div variants={fadeInUp} className={styles.sectionHeader}>
            <span className={`${styles.topicTag} ${styles.topic1Tag}`}>Project Topic 01</span>
            <h2 className={styles.sectionTitle}>Unified Cyber Defence & Public Awareness Ecosystem</h2>
          </motion.div>

          <div className={styles.topicGrid}>
            {/* Left Column: Core Breakdown */}
            <motion.div variants={fadeInUp}>
              {/* Problem Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <svg width="22" height="22" fill="none" stroke="#f43f5e" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  <h3 className={styles.cardTitle}>1. The Problem</h3>
                </div>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>India faces a severe socio-economic crisis with a 24% spike in cybercrimes in 2025 alone.</li>
                  <li className={styles.bulletItem}>Indian citizens lost ₹22,495 crore to digital scams in a single year, with six-year cumulative losses reaching ₹52,976 crore.</li>
                  <li className={styles.bulletItem}>Fraudsters leverage Generative AI and deepfakes to execute complex "digital arrest" scams and impersonations (8% of total losses).</li>
                  <li className={styles.bulletItem}>Small & Medium Enterprises (SMEs) lack affordable, active-response SOC tools to stop ransomware and endpoint process exploitation.</li>
                </ul>
              </div>

              {/* Solution Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <svg width="22" height="22" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <h3 className={styles.cardTitle}>2. The Solution</h3>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  A dual-sided cybersecurity ecosystem bridging enterprise-grade active protection with public digital literacy and incident management.
                </p>
                <div className={styles.moduleGrid}>
                  <div className={styles.moduleBox}>
                    <div className={styles.moduleBoxTitle}>Enterprise Active SOC</div>
                    <div className={styles.moduleBoxDesc}>Centralized dashboard communicating with desktop agents to autonomously terminate malicious `.exe` processes in real-time.</div>
                  </div>
                  <div className={styles.moduleBox}>
                    <div className={styles.moduleBoxTitle}>Media Forensics Engine</div>
                    <div className={styles.moduleBoxDesc}>Public AI suite utilizing CNNs & XAI to verify audio/video deepfakes and manipulated images.</div>
                  </div>
                  <div className={styles.moduleBox}>
                    <div className={styles.moduleBoxTitle}>Gamified Citizen Hub</div>
                    <div className={styles.moduleBoxDesc}>Interactive training module certifying citizens as "Cyber Warriors" against phishing and scam tactics.</div>
                  </div>
                  <div className={styles.moduleBox}>
                    <div className={styles.moduleBoxTitle}>Emergency Triage Companion</div>
                    <div className={styles.moduleBoxDesc}>Real-time AI incident helper guiding scam victims through legal reporting and technical isolation steps.</div>
                  </div>
                </div>
              </div>

              {/* Welfare & Feasibility Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <svg width="22" height="22" fill="none" stroke="#38bdf8" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  <h3 className={styles.cardTitle}>3. Social Welfare & Feasibility</h3>
                </div>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}><strong>Social Welfare:</strong> Protects life savings in Tier-2/Tier-3 towns where rapid internet growth outpaces digital literacy.</li>
                  <li className={styles.bulletItem}><strong>Tech Stack:</strong> Python (FastAPI/Django) & React for web; C++/C# for endpoint process control; PyTorch/TensorFlow (ResNet/EfficientNet) for deepfake detection APIs.</li>
                  <li className={styles.bulletItem}><strong>Feasibility:</strong> High. Low-overhead endpoint architecture paired with modular ML REST endpoints.</li>
                </ul>
              </div>
            </motion.div>

            {/* Right Column: Prototype Link & Architecture Preview */}
            <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className={styles.architectureBox}>
                <div className={styles.imgTag}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Sys-Arch Tag #01: Cyber Defence Blueprint
                </div>
                <div className={styles.imageWrapper}>
                  <img 
                    src="ts1.jpeg" 
                    alt="Cyber Defence System Architecture Blueprint" 
                    className={styles.archImage}
                  />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                  Figure 1.1: Multi-tiered workflow for endpoint process isolation and public forensics.
                </p>
              </div>

              {/* Prototype CTA Button */}
              <div className={styles.card} style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
                  Topic 1 Live Interactive Prototype
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Explore the active AlphaShield enterprise SOC security dashboard.
                </p>
                <a 
                  href="https://alphasheild.vercel.app/dashboard" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.prototypeButton} ${styles.topic1Btn}`}
                >
                  Launch AlphaShield Dashboard
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ==================== TOPIC 2 ==================== */}
        <motion.section 
          id="topic2" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ marginBottom: '6rem' }}
        >
          <motion.div variants={fadeInUp} className={styles.sectionHeader}>
            <span className={`${styles.topicTag} ${styles.topic2Tag}`}>Project Topic 02</span>
            <h2 className={styles.sectionTitle}>Autonomous AI Career & Application Tracking Engine</h2>
          </motion.div>

          <div className={styles.topicGrid}>
            {/* Left Column: Prototype Link & Architecture Preview */}
            <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className={styles.architectureBox}>
                <div className={styles.imgTag} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Sys-Arch Tag #02: Agentic Career Pipeline
                </div>
                <div className={styles.imageWrapper}>
                  <img 
                    src="ts2.jpeg" 
                    alt="Autonomous AI Career Engine Blueprint" 
                    className={styles.archImage}
                  />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                  Figure 2.1: Agentic loop connecting candidates, LLM evaluators, and recruiter portals.
                </p>
              </div>

              {/* Prototype CTA Button */}
              <div className={styles.card} style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
                  Topic 2 Live Interactive Prototype
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Experience the ThinkHatch autonomous career engine and portfolio ecosystem.
                </p>
                <a 
                  href="https://thinkhatch.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.prototypeButton} ${styles.topic2Btn}`}
                >
                  Launch ThinkHatch Platform
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              </div>
            </motion.div>

            {/* Right Column: Core Breakdown */}
            <motion.div variants={fadeInUp}>
              {/* Problem Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <svg width="22" height="22" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <h3 className={styles.cardTitle}>1. The Problem</h3>
                </div>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}>75% of job candidate resumes are rejected by Applicant Tracking Systems (ATS) prior to human review due to formatting errors or keyword mismatches.</li>
                  <li className={styles.bulletItem}>With over 60% of job seekers using AI to generate resumes, application volumes have exploded with low-quality submissions.</li>
                  <li className={styles.bulletItem}>HR recruiters are overwhelmed by automated spam, making it nearly impossible to identify truly skilled engineering talent.</li>
                </ul>
              </div>

              {/* Solution Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <svg width="22" height="22" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  <h3 className={styles.cardTitle}>2. The Solution</h3>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  An end-to-end Agentic AI job-hunting engine that replaces manual applications with dynamic skill optimization and auto-submission.
                </p>
                <div className={styles.moduleGrid}>
                  <div className={styles.moduleBox}>
                    <div className={styles.moduleBoxTitle}>Candidate Profile Engine</div>
                    <div className={styles.moduleBoxDesc}>Intakes raw user credentials to construct dynamically formatted ATS portfolios.</div>
                  </div>
                  <div className={styles.moduleBox}>
                    <div className={styles.moduleBoxTitle}>Dynamic Skill Analyzer</div>
                    <div className={styles.moduleBoxDesc}>Identifies market gaps and issues micro-learning modules to push ATS match score &gt; 90%.</div>
                  </div>
                  <div className={styles.moduleBox}>
                    <div className={styles.moduleBoxTitle}>Autonomous Application Bot</div>
                    <div className={styles.moduleBoxDesc}>Automates job searches and credential submissions across external hiring boards.</div>
                  </div>
                  <div className={styles.moduleBox}>
                    <div className={styles.moduleBoxTitle}>Enterprise Recruiter Panel</div>
                    <div className={styles.moduleBoxDesc}>Receives pre-filtered candidate streams meeting strict 90% technical threshold criteria.</div>
                  </div>
                </div>
              </div>

              {/* Welfare & Feasibility Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <svg width="22" height="22" fill="none" stroke="#14b8a6" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                  <h3 className={styles.cardTitle}>3. Social Welfare & Feasibility</h3>
                </div>
                <ul className={styles.bulletList}>
                  <li className={styles.bulletItem}><strong>Social Welfare:</strong> Levels the playing field for students from non-elite colleges without expensive counseling, placing focus strictly on verified skill capability.</li>
                  <li className={styles.bulletItem}><strong>Tech Stack:</strong> LangChain / CrewAI / AutoGen for multi-agent loops; OpenAI / Llama-3 for NLP tasks; Playwright or Selenium with Python for browser automation; Next.js / React for front-end.</li>
                  <li className={styles.bulletItem}><strong>Feasibility:</strong> High. Leverages standard web automation and modern API framework abstractions.</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ==================== ARCHITECTURE OVERVIEW ==================== */}
        <motion.section 
          id="architectures"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ marginBottom: '6rem' }}
        >
          <motion.div variants={fadeInUp} className={styles.sectionHeader} style={{ textAlign: 'center' }}>
            <span className={styles.badge}>Sys-Arch Tag #03</span>
            <h2 className={styles.sectionTitle}>Unified System Architecture Master Diagram</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className={styles.architectureBox}>
            <div className={styles.imageWrapper}>
              <img 
                src="ts3.png" 
                alt="Unified Architectural Master Diagram" 
                className={styles.archImage}
              />
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', textAlign: 'center' }}>
              Figure 3.1: Complete architectural flow mapping multi-agent dispatching, local system endpoints, and public UI portals.
            </p>
          </motion.div>
        </motion.section>

        {/* ==================== RESEARCH & DOCUMENTARY CONTEXT ==================== */}
        <motion.section 
          id="research"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className={styles.researchBlock}
        >
          <motion.h2 variants={fadeInUp} style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc' }}>
            Real-World Context & Documentaries
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Academic and societal validation grounding both proposed engineering topics.
          </motion.p>

          <div className={styles.researchGrid}>
            <motion.div variants={fadeInUp} className={styles.card} style={{ margin: 0, background: 'rgba(15, 23, 42, 0.5)' }}>
              <div className={styles.cardHeader}>
                <svg width="20" height="20" fill="none" stroke="#f43f5e" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f1f5f9' }}>The "Digital Arrest" Fraud Phenomenon</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                Digital arrest scams force victims onto live video feeds under the guise of fake police or law enforcement mandates. Scammers combine deepfake audio, falsified arrest warrants, and continuous video monitoring to isolate victims for days until life savings are transferred. These events underscore the urgent need for a public deepfake verification and real-time triage hub.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className={styles.card} style={{ margin: 0, background: 'rgba(15, 23, 42, 0.5)' }}>
              <div className={styles.cardHeader}>
                <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f1f5f9' }}>Automated Hiring & Algorithmic Bias</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                Modern ATS platforms reject candidate resumes on rigid formatting markers rather than raw technical aptitude. Research shows that layering uncalibrated AI onto hiring pipelines leads to systemic exclusion. An autonomous career engine with a transparent, strict 90% technical skill-matching threshold acts as a neutral filter ensuring equitable recruitment access.
              </p>
            </motion.div>
          </div>
        </motion.section>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem 1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        <p>Guru Gobind Singh College of Engineering & Research Centre (GCOERC), Nashik</p>
        <p style={{ marginTop: '0.5rem' }}>Department of Computer Engineering | Project Group 17</p>
      </footer>
    </div>
  );
}