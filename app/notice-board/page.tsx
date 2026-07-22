"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './NoticeBoard.module.css';

// --- FIREBASE IMPORTS ---
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from "@/src/firebase";

// --- TYPESCRIPT INTERFACES ---
interface Notice {
  id: string;
  date: string;
  name: string;
  position: string;
  text: string;
  tag: string;
  isPinned: boolean;
  createdAt?: any; 
}

export default function NoticeBoard() {
  // UI State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Form State
  const [date, setDate] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [position, setPosition] = useState<string>("Member");
  const [tag, setTag] = useState<string>("Normal");
  const [noticeText, setNoticeText] = useState<string>("");

  // Firebase Data State
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- 1. READ FROM FIREBASE ---
  useEffect(() => {
    const noticesQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(noticesQuery, (snapshot) => {
      const fetchedNotices: Notice[] = [];
      snapshot.forEach((doc) => {
        fetchedNotices.push({ id: doc.id, ...doc.data() } as Notice);
      });
      setNotices(fetchedNotices);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching notices:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. WRITE TO FIREBASE ---
  const handleAddNotice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date || !name || !noticeText) return;
    
    setIsPublishing(true);

    try {
      await addDoc(collection(db, "notices"), {
        date,
        name,
        position,
        text: noticeText,
        tag,
        isPinned: false,
        createdAt: serverTimestamp()
      });
      
      setNoticeText("");
      setDate("");
      setTag("Normal");
      setIsFormOpen(false); // Close modal on success
    } catch (error) {
      console.error("Error publishing notice:", error);
      alert("Failed to publish notice.");
    } finally {
      setIsPublishing(false);
    }
  };

  // --- 3. UPDATE & DELETE FIREBASE ---
  const togglePin = async (id: string, currentPinStatus: boolean) => {
    try {
      const noticeRef = doc(db, "notices", id);
      await updateDoc(noticeRef, { isPinned: !currentPinStatus });
    } catch (error) {
      console.error("Error updating pin status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteDoc(doc(db, "notices", id));
      } catch (error) {
        console.error("Error deleting notice:", error);
      }
    }
  };

  // --- SORTING LOGIC ---
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.isPinned === b.isPinned) return 0;
    return a.isPinned ? -1 : 1;
  });

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.backBtn}>← Back</Link>
            <h1 className={styles.title}>📌 Notice Board</h1>
          </div>
          <button 
            className={styles.addNoticeBtn} 
            onClick={() => setIsFormOpen(true)}
          >
            + Create Notice
          </button>
        </header>

        {/* MAIN SECTION: Notice Feed */}
        <main className={styles.mainFeed}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading notices...</p>
            </div>
          ) : sortedNotices.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>No notices yet!</h2>
              <p>Click "Create Notice" to broadcast a message to the team.</p>
            </div>
          ) : (
            <div className={styles.feedList}>
              {sortedNotices.map((notice) => (
                <div key={notice.id} className={`${styles.noticeCard} ${notice.isPinned ? styles.pinnedCard : ''}`}>
                  
                  <div className={styles.cardHeader}>
                    <div className={styles.authorInfo}>
                      <span className={styles.authorName}>{notice.name}</span>
                      <span className={`${styles.posBadge} ${styles[notice.position as keyof typeof styles]}`}>
                        {notice.position}
                      </span>
                      <span className={styles.dateText}>
                        {new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className={styles.cardActions}>
                      <button 
                        onClick={() => togglePin(notice.id, notice.isPinned)} 
                        className={`${styles.iconBtn} ${styles.pinBtn} ${notice.isPinned ? styles.activePin : ''}`}
                        title={notice.isPinned ? "Unpin Notice" : "Pin Notice"}
                      >
                        {notice.isPinned ? '📍' : '📌'}
                      </button>
                      <button 
                        onClick={() => handleDelete(notice.id)} 
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        title="Delete Notice"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className={styles.noticeText}>{notice.text}</p>
                  
                  <div className={styles.cardFooter}>
                    <span className={`${styles.tagBadge} ${styles[notice.tag.replace(/\s+/g, '') as keyof typeof styles]}`}>
                      {notice.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* MODAL: Add Notice Form */}
        {isFormOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsFormOpen(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              
              <div className={styles.modalHeader}>
                <h2>Publish a Notice</h2>
                <button className={styles.closeBtn} onClick={() => setIsFormOpen(false)}>✕</button>
              </div>

              <form onSubmit={handleAddNotice} className={styles.form}>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Your Name</label>
                    <input type="text" placeholder="e.g. Sumit" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Position</label>
                    <select value={position} onChange={(e) => setPosition(e.target.value)}>
                      <option value="Teacher">Teacher</option>
                      <option value="Leader">Leader</option>
                      <option value="Member">Member</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Priority Tag</label>
                    <select value={tag} onChange={(e) => setTag(e.target.value)}>
                      <option value="Normal">Normal</option>
                      <option value="Important">Important</option>
                      <option value="Very Important">Very Important</option>
                    </select>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Notice Content</label>
                  <textarea 
                    rows={4} 
                    placeholder="Type your announcement here..." 
                    value={noticeText} 
                    onChange={(e) => setNoticeText(e.target.value)} 
                    required 
                  />
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.primaryBtn} disabled={isPublishing}>
                    {isPublishing ? "Publishing..." : "Post Notice"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}