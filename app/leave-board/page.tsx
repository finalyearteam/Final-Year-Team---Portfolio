"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './LeaveBoard.module.css';

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
import { db } from "@/src/firebase"; // ⚠️ Adjust this path to your config

// --- TYPESCRIPT INTERFACES ---
interface LeaveRequest {
  id: string;
  date: string;
  name: string;
  reason: string;
  pendingWork: string;
  status: 'Pending' | 'Approved' | 'Denied';
  createdAt?: any; 
}

export default function LeaveBoard() {
  // UI State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Form State
  const [date, setDate] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [pendingWork, setPendingWork] = useState<string>("");

  // Firebase Data State
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- 1. READ FROM FIREBASE ---
  useEffect(() => {
    const leavesQuery = query(collection(db, "leaves"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(leavesQuery, (snapshot) => {
      const fetchedLeaves: LeaveRequest[] = [];
      snapshot.forEach((doc) => {
        fetchedLeaves.push({ id: doc.id, ...doc.data() } as LeaveRequest);
      });
      setLeaves(fetchedLeaves);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching leaves:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. WRITE TO FIREBASE ---
  const handleAddLeave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date || !name || !reason) return;
    
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "leaves"), {
        date,
        name,
        reason,
        pendingWork: pendingWork || "None", // Default if left empty
        status: 'Pending', // New requests always start as Pending
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setDate("");
      setName("");
      setReason("");
      setPendingWork("");
      setIsFormOpen(false); // Close modal on success
    } catch (error) {
      console.error("Error submitting leave:", error);
      alert("Failed to submit leave request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. UPDATE STATUS (Permissions) ---
  const handleStatusChange = async (id: string, newStatus: 'Approved' | 'Denied' | 'Pending') => {
    try {
      const leaveRef = doc(db, "leaves", id);
      await updateDoc(leaveRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  // --- 4. DELETE RECORD ---
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this leave record?")) {
      try {
        await deleteDoc(doc(db, "leaves", id));
      } catch (error) {
        console.error("Error deleting leave:", error);
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.backBtn}>← Back</Link>
            <h1 className={styles.title}>🏖️ Leave Board</h1>
          </div>
          <button 
            className={styles.addBtn} 
            onClick={() => setIsFormOpen(true)}
          >
            + Request Leave
          </button>
        </header>

        {/* MAIN SECTION: Leave Feed */}
        <main className={styles.mainFeed}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading leave records...</p>
            </div>
          ) : leaves.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>No leave requests yet!</h2>
              <p>Click "Request Leave" to submit an application.</p>
            </div>
          ) : (
            <div className={styles.feedList}>
              {leaves.map((leave) => (
                <div key={leave.id} className={`${styles.leaveCard} ${styles[leave.status]}`}>
                  
                  <div className={styles.cardHeader}>
                    <div className={styles.applicantInfo}>
                      <span className={styles.applicantName}>{leave.name}</span>
                      <span className={`${styles.statusBadge} ${styles[`badge${leave.status}`]}`}>
                        {leave.status}
                      </span>
                    </div>
                    
                    <div className={styles.cardActions}>
                      {/* Permission Buttons */}
                      {leave.status !== 'Approved' && (
                        <button 
                          onClick={() => handleStatusChange(leave.id, 'Approved')} 
                          className={`${styles.actionBtn} ${styles.approveBtn}`}
                          title="Approve Leave"
                        >
                          ✅ Approve
                        </button>
                      )}
                      {leave.status !== 'Denied' && (
                        <button 
                          onClick={() => handleStatusChange(leave.id, 'Denied')} 
                          className={`${styles.actionBtn} ${styles.denyBtn}`}
                          title="Deny Leave"
                        >
                          ❌ Deny
                        </button>
                      )}
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(leave.id)} 
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        title="Delete Record"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className={styles.leaveDetails}>
                    <div className={styles.detailGroup}>
                      <strong>Leave Date:</strong> 
                      <span>{new Date(leave.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    
                    <div className={styles.detailGroup}>
                      <strong>Reason:</strong>
                      <p>{leave.reason}</p>
                    </div>
                    
                    <div className={styles.detailGroup}>
                      <strong>Pending Work:</strong>
                      <p className={styles.pendingWorkText}>{leave.pendingWork}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>

        {/* MODAL: Request Leave Form */}
        {isFormOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsFormOpen(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              
              <div className={styles.modalHeader}>
                <h2>Request a Leave</h2>
                <button className={styles.closeBtn} onClick={() => setIsFormOpen(false)}>✕</button>
              </div>

              <form onSubmit={handleAddLeave} className={styles.form}>
                
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Applicant Name</label>
                    <input type="text" placeholder="e.g. Prathamesh" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Leave Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Reason for Leave</label>
                  <textarea 
                    rows={2} 
                    placeholder="Why are you taking a leave?" 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)} 
                    required 
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Pending Work / Handover Details</label>
                  <textarea 
                    rows={2} 
                    placeholder="What tasks are pending and who is handling them?" 
                    value={pendingWork} 
                    onChange={(e) => setPendingWork(e.target.value)} 
                    required 
                  />
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
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