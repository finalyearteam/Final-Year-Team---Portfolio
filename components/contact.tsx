"use client";

import { useState } from "react";
import styles from "./Contact.module.css";

// Firebase imports are fully active
import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/firebase"; // Update this path if your firebase.js is in a different folder

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      // Sending the form data directly to your Firestore 'contactMessages' collection
      await addDoc(collection(db, "contactMessages"), {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        message: formData.message,
        timestamp: new Date(),
      });

      setSuccessMessage("Message sent successfully! We will get back to you soon.");
      
      // Clear the form fields after successful submission
      setFormData({ name: "", email: "", mobile: "", message: "" });
    } catch (error) {
      console.error("Error submitting form: ", error);
      setSuccessMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.ambientGlow1}></div>

      <div className={styles.headerContent}>
        <h2 className={styles.sectionTitle}>Get In Touch</h2>
        <p className={styles.sectionSubtitle}>
          Have a question or want to collaborate? Drop us a message.
        </p>
      </div>

      <div className={styles.contactContainer}>
        
        {/* Left Side: Info & Socials */}
        <div className={styles.infoSide}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Contact Information</h3>
            
            <div className={styles.infoDetail}>
              <span className={styles.icon}>📍</span>
              <div>
                <strong>Address</strong>
                <p>GCOERC, Nashik, Maharashtra, India</p>
              </div>
            </div>
            
            <div className={styles.infoDetail}>
              <span className={styles.icon}>✉️</span>
              <div>
                <strong>Email</strong>
                <p>finalyearteam.gcoerc@gmail.com</p>
              </div>
            </div>

            <h4 className={styles.socialTitle}>Follow Our Journey</h4>
            <div className={styles.socialGrid}>
              <a href="https://github.com/finalyearteam" target="_blank" rel="noreferrer" className={styles.socialBtn}>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/final-year-team-377928422/" target="_blank" rel="noreferrer" className={styles.socialBtn}>
                LinkedIn
              </a>
              <a href="https://www.youtube.com/@finalyearteam" target="_blank" rel="noreferrer" className={styles.socialBtn}>
                YouTube
              </a>
              <a href="https://www.instagram.com/final_year_team/" target="_blank" rel="noreferrer" className={styles.socialBtn}>
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className={styles.formSide}>
          <form onSubmit={handleSubmit} className={styles.glassForm}>
            <h3 className={styles.formTitle}>Send a Message</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
                placeholder="John Doe"
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  placeholder="john@example.com"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="mobile">Mobile Number</label>
                <input 
                  type="tel" 
                  id="mobile" 
                  name="mobile" 
                  value={formData.mobile}
                  onChange={handleChange}
                  required 
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message">Your Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {successMessage && (
              <p className={styles.statusMessage}>{successMessage}</p>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}