"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './PenaltyBoard.module.css';

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
interface Penalty {
  id: string;
  name: string;
  reason: string;
  amount: number;
  type: string;
  submissionDate: string;
  extraNote: string;
  status: 'Pending' | 'Apology Submitted' | 'Apology Accepted' | 'Apology Rejected' | 'Completed';
  apologyReason?: string;
  createdAt?: any; 
}

export default function PenaltyBoard() {
  // --- UI STATES ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isApologyOpen, setIsApologyOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activePenaltyId, setActivePenaltyId] = useState<string | null>(null);

  // --- FORM STATES ---
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState("Late Submission");
  const [submissionDate, setSubmissionDate] = useState("");
  const [extraNote, setExtraNote] = useState("");
  const [apologyText, setApologyText] = useState("");

  // --- DATA STATES ---
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. READ DATA ---
  useEffect(() => {
    const q = query(collection(db, "penalties"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Penalty[] = [];
      snapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() } as Penalty));
      setPenalties(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. ADD OR EDIT PENALTY ---
  const handleSavePenalty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !reason || !amount || !submissionDate) return;
    setIsSubmitting(true);

    const penaltyData = {
      name, reason, amount: Number(amount), type, submissionDate, extraNote,
      status: editingId ? undefined : 'Pending', // Keep existing status if editing
      createdAt: serverTimestamp()
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "penalties", editingId), penaltyData);
      } else {
        await addDoc(collection(db, "penalties"), penaltyData);
      }
      closeMainForm();
    } catch (error) {
      console.error("Error saving penalty:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. APOLOGY SYSTEM ---
  const handleSubmitApology = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePenaltyId || !apologyText) return;
    setIsSubmitting(true);
    
    try {
      await updateDoc(doc(db, "penalties", activePenaltyId), {
        status: 'Apology Submitted',
        apologyReason: apologyText
      });
      setIsApologyOpen(false);
      setApologyText("");
    } catch (error) {
      console.error("Error submitting apology:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. STATUS UPDATES & DELETION ---
  const handleStatusChange = async (id: string, newStatus: Penalty['status']) => {
    try {
      await updateDoc(doc(db, "penalties", id), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this penalty?")) {
      await deleteDoc(doc(db, "penalties", id));
    }
  };

  // --- HELPERS ---
  const openEditForm = (p: Penalty) => {
    setEditingId(p.id); setName(p.name); setReason(p.reason);
    setAmount(p.amount); setType(p.type); setSubmissionDate(p.submissionDate);
    setExtraNote(p.extraNote || ""); setIsFormOpen(true);
  };

  const closeMainForm = () => {
    setIsFormOpen(false); setEditingId(null); setName(""); setReason("");
    setAmount(""); setType("Late Submission"); setSubmissionDate(""); setExtraNote("");
  };

  const totalPenaltyAmount = penalties.reduce((acc, curr) => 
    curr.status === 'Completed' ? acc : acc + curr.amount, 0
  );

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.backBtn}>← Back</Link>
            <h1 className={styles.title}>⚠️ Penalty Board</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.summaryBtn} onClick={() => setIsSummaryOpen(true)}>
              📊 View Summary
            </button>
            <button className={styles.addBtn} onClick={() => setIsFormOpen(true)}>
              + Add Penalty
            </button>
          </div>
        </header>

        {/* MAIN FEED */}
        <main className={styles.mainFeed}>
          {isLoading ? (
             <div className={styles.emptyState}>Loading records...</div>
          ) : penalties.length === 0 ? (
            <div className={styles.emptyState}>No penalties recorded. Great job team!</div>
          ) : (
            <div className={styles.feedList}>
              {penalties.map((p) => (
                <div key={p.id} className={`${styles.penaltyCard} ${styles[p.status.replace(/\s+/g, '')]}`}>
                  
                  {/* CARD HEADER */}
                  <div className={styles.cardHeader}>
                    <div className={styles.userInfo}>
                      <span className={styles.name}>{p.name}</span>
                      <span className={`${styles.statusBadge} ${styles['badge' + p.status.replace(/\s+/g, '')]}`}>
                        {p.status}
                      </span>
                    </div>
                    
                    <div className={styles.actions}>
                      <button onClick={() => openEditForm(p)} className={styles.iconBtn} title="Edit">✏️</button>
                      <button onClick={() => handleDelete(p.id)} className={styles.iconBtn} title="Delete">🗑️</button>
                    </div>
                  </div>

                  {/* CARD DETAILS */}
                  <div className={styles.detailsGrid}>
                    <div className={styles.detail}><strong>Type:</strong> {p.type}</div>
                    <div className={styles.detail}><strong>Amount:</strong> ₹{p.amount}</div>
                    <div className={styles.detail}><strong>Due Date:</strong> {new Date(p.submissionDate).toLocaleDateString()}</div>
                  </div>
                  
                  <div className={styles.reasonBox}>
                    <strong>Reason:</strong> <p>{p.reason}</p>
                    {p.extraNote && <p className={styles.note}>*Note: {p.extraNote}</p>}
                  </div>

                  {/* APOLOGY SECTION */}
                  {p.apologyReason && (
                    <div className={styles.apologyBox}>
                      <strong>Apology Submitted:</strong>
                      <p>"{p.apologyReason}"</p>
                    </div>
                  )}

                  {/* CONTEXTUAL ACTION BUTTONS */}
                  <div className={styles.cardFooter}>
                    {p.status === 'Pending' && (
                      <>
                        <button onClick={() => { setActivePenaltyId(p.id); setIsApologyOpen(true); }} className={`${styles.actionBtn} ${styles.apologyBtn}`}>
                          🙏 Say Sorry (Appeal)
                        </button>
                        <button onClick={() => handleStatusChange(p.id, 'Completed')} className={`${styles.actionBtn} ${styles.completeBtn}`}>
                          💰 Mark Paid/Completed
                        </button>
                      </>
                    )}

                    {p.status === 'Apology Submitted' && (
                      <div className={styles.adminActions}>
                        <button onClick={() => handleStatusChange(p.id, 'Apology Accepted')} className={`${styles.actionBtn} ${styles.approveBtn}`}>
                          ✅ Accept Apology
                        </button>
                        <button onClick={() => handleStatusChange(p.id, 'Apology Rejected')} className={`${styles.actionBtn} ${styles.rejectBtn}`}>
                          ❌ Reject Apology
                        </button>
                      </div>
                    )}

                    {p.status === 'Apology Rejected' && (
                      <button onClick={() => handleStatusChange(p.id, 'Completed')} className={`${styles.actionBtn} ${styles.completeBtn}`}>
                        💰 Mark Paid/Completed
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>

        {/* MODAL 1: ADD/EDIT PENALTY */}
        {isFormOpen && (
          <div className={styles.modalOverlay} onClick={closeMainForm}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2>{editingId ? "Edit Penalty" : "Issue Penalty"}</h2>
              <form onSubmit={handleSavePenalty} className={styles.form}>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Amount (₹)</label>
                    <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
                  </div>
                </div>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Type</label>
                    <select value={type} onChange={e => setType(e.target.value)}>
                      <option>Late Submission</option>
                      <option>Misbehavior</option>
                      <option>Missing Meeting</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Date</label>
                    <input type="date" value={submissionDate} onChange={e => setSubmissionDate(e.target.value)} required />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Reason</label>
                  <textarea rows={2} value={reason} onChange={e => setReason(e.target.value)} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Extra Note (Optional)</label>
                  <input type="text" value={extraNote} onChange={e => setExtraNote(e.target.value)} />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={closeMainForm}>Cancel</button>
                  <button type="submit" className={styles.primaryBtn}>{editingId ? "Update" : "Save"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: SUBMIT APOLOGY */}
        {isApologyOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsApologyOpen(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2>Submit Apology</h2>
              <p className={styles.modalSub}>Explain why this happened and ask for forgiveness.</p>
              <form onSubmit={handleSubmitApology} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Your Reason / Apology</label>
                  <textarea rows={4} value={apologyText} onChange={e => setApologyText(e.target.value)} required placeholder="I apologize for..." />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsApologyOpen(false)}>Cancel</button>
                  <button type="submit" className={styles.primaryBtn}>Submit Apology</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: SUMMARY VIEW */}
        {isSummaryOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsSummaryOpen(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div className={styles.summaryHeader}>
                <h2>Penalty Summary</h2>
                <button className={styles.iconBtn} onClick={() => setIsSummaryOpen(false)}>✕</button>
              </div>
              
              <div className={styles.summaryTotalBox}>
                <span>Total Active Penalties Amount:</span>
                <h3>₹{totalPenaltyAmount}</h3>
              </div>

              <div className={styles.summaryList}>
                {penalties.map(p => (
                  <div key={p.id} className={styles.summaryItem}>
                    <div className={styles.sumLeft}>
                      <strong>{p.name}</strong> - {p.type}
                      <span className={styles.sumStatus}>{p.status}</span>
                    </div>
                    <div className={styles.sumRight}>₹{p.amount}</div>
                  </div>
                ))}
              </div>

              <div className={styles.modalActions}>
                <button className={styles.primaryBtn} onClick={() => { setIsSummaryOpen(false); setIsFormOpen(true); }}>
                  + Quick Add Penalty
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}