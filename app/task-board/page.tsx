"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './TaskBoard.module.css';

// --- FIREBASE IMPORTS ---
import { 
  collection, addDoc, onSnapshot, query, orderBy, 
  doc, updateDoc, deleteDoc, serverTimestamp 
} from 'firebase/firestore';
import { db } from "@/src/firebase"; 

// --- TYPESCRIPT INTERFACES ---
interface Task {
  id: string;
  taskName: string;
  assignedTo: string;
  deadline: string;
  penaltyAmount: number;
  assignedBy: string;
  status: 'Pending' | 'Completed' | 'Replaced';
  createdAt?: any; 
}

const TEAM_MEMBERS = [
  "Sumit Lasulkar",
  "Anagha Kaloge",
  "Snehal Lashkar",
  "Om Mandlik"
];

export default function TaskBoard() {
  // --- UI STATES ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterName, setFilterName] = useState<string | null>(null);

  // --- FORM STATES ---
  const [taskName, setTaskName] = useState("");
  const [assignedTo, setAssignedTo] = useState(TEAM_MEMBERS[0]);
  const [deadline, setDeadline] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState<number | "">("");
  const [assignedBy, setAssignedBy] = useState("");

  // --- DATA STATES ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. READ DATA ---
  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Task[] = [];
      snapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() } as Task));
      setTasks(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. ADD TASK ---
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !deadline || !assignedBy) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "tasks"), {
        taskName,
        assignedTo,
        deadline,
        penaltyAmount: Number(penaltyAmount) || 0,
        assignedBy,
        status: 'Pending',
        createdAt: serverTimestamp()
      });
      closeForm();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. STATUS UPDATES & DELETION ---
  const handleStatusChange = async (id: string, newStatus: Task['status']) => {
    try {
      await updateDoc(doc(db, "tasks", id), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task completely?")) {
      await deleteDoc(doc(db, "tasks", id));
    }
  };

  // --- HELPERS & FILTERS ---
  const closeForm = () => {
    setIsFormOpen(false); 
    setTaskName(""); 
    setDeadline(""); 
    setPenaltyAmount(""); 
    setAssignedBy("");
  };

  // Sort tasks by deadline (closest first)
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  
  // Filter by selected team member
  const displayedTasks = filterName 
    ? sortedTasks.filter(t => t.assignedTo === filterName)
    : sortedTasks;

  // Calculate stats for a specific member
  const getMemberStats = (name: string) => {
    const memberTasks = tasks.filter(t => t.assignedTo === name);
    const completed = memberTasks.filter(t => t.status === 'Completed').length;
    const pending = memberTasks.filter(t => t.status === 'Pending').length;
    return { total: memberTasks.length, completed, pending };
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.backBtn}>← Back</Link>
            <h1 className={styles.title}>📋 Task & Deadline Board</h1>
          </div>
          <button className={styles.addBtn} onClick={() => setIsFormOpen(true)}>
            + Assign New Task
          </button>
        </header>

        {/* TEAM SUMMARY BOARD */}
        <section className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>Team Performance <span>(Click a name to filter tasks)</span></h2>
          <div className={styles.summaryGrid}>
            {TEAM_MEMBERS.map(member => {
              const stats = getMemberStats(member);
              const isActive = filterName === member;
              return (
                <div 
                  key={member} 
                  className={`${styles.memberCard} ${isActive ? styles.activeCard : ''}`}
                  onClick={() => setFilterName(isActive ? null : member)}
                >
                  <h3>{member}</h3>
                  <div className={styles.statsRow}>
                    <div className={styles.statBox}>
                      <span>Assigned</span>
                      <strong>{stats.total}</strong>
                    </div>
                    <div className={`${styles.statBox} ${styles.statCompleted}`}>
                      <span>Done</span>
                      <strong>{stats.completed}</strong>
                    </div>
                    <div className={`${styles.statBox} ${styles.statPending}`}>
                      <span>Pending</span>
                      <strong>{stats.pending}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MAIN FEED (DEADLINES) */}
        <main className={styles.mainFeed}>
          <div className={styles.feedHeader}>
            <h2 className={styles.sectionTitle}>
              {filterName ? `${filterName}'s Deadlines` : "All Team Deadlines"}
            </h2>
            {filterName && (
              <button className={styles.clearFilterBtn} onClick={() => setFilterName(null)}>
                ✕ Clear Filter
              </button>
            )}
          </div>

          {isLoading ? (
             <div className={styles.emptyState}>Loading tasks...</div>
          ) : displayedTasks.length === 0 ? (
            <div className={styles.emptyState}>No tasks found for this view!</div>
          ) : (
            <div className={styles.feedList}>
              {displayedTasks.map((t) => (
                <div key={t.id} className={`${styles.taskCard} ${styles[t.status]}`}>
                  
                  <div className={styles.cardHeader}>
                    <div className={styles.taskTitleGroup}>
                      <span className={styles.taskName}>{t.taskName}</span>
                      <span className={`${styles.statusBadge} ${styles['badge' + t.status]}`}>
                        {t.status}
                      </span>
                    </div>
                    <button onClick={() => handleDelete(t.id)} className={styles.iconBtn} title="Delete Task">🗑️</button>
                  </div>

                  <div className={styles.detailsGrid}>
                    <div className={styles.detail}>
                      <strong>Assigned To:</strong> 
                      <span className={styles.highlightName}>{t.assignedTo}</span>
                    </div>
                    <div className={styles.detail}>
                      <strong>Deadline:</strong> 
                      <span className={styles.urgentDate}>{new Date(t.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.detail}>
                      <strong>Assigned By:</strong> {t.assignedBy}
                    </div>
                    <div className={styles.detail}>
                      <strong>Penalty if missed:</strong> 
                      <span className={styles.penaltyText}>₹{t.penaltyAmount}</span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className={styles.cardFooter}>
                    {t.status !== 'Completed' && (
                      <button onClick={() => handleStatusChange(t.id, 'Completed')} className={`${styles.actionBtn} ${styles.completeBtn}`}>
                        ✅ Mark as Completed
                      </button>
                    )}
                    
                    {t.status === 'Pending' && (
                      <button onClick={() => handleStatusChange(t.id, 'Replaced')} className={`${styles.actionBtn} ${styles.replaceBtn}`}>
                        🔄 Replace / Cannot Complete
                      </button>
                    )}

                    {t.status !== 'Pending' && (
                      <button onClick={() => handleStatusChange(t.id, 'Pending')} className={`${styles.actionBtn} ${styles.revertBtn}`}>
                        ⏪ Revert to Pending
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* MODAL: ADD TASK */}
        {isFormOpen && (
          <div className={styles.modalOverlay} onClick={closeForm}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2>Assign New Task</h2>
              <form onSubmit={handleAddTask} className={styles.form}>
                
                <div className={styles.inputGroup}>
                  <label>Task Description</label>
                  <textarea rows={2} value={taskName} onChange={e => setTaskName(e.target.value)} required placeholder="What needs to be done?"/>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Assign To</label>
                    <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                      {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Deadline</label>
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
                  </div>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Penalty Amount (₹)</label>
                    <input type="number" value={penaltyAmount} onChange={e => setPenaltyAmount(Number(e.target.value))} placeholder="e.g. 50" required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Assigned By</label>
                    <input type="text" value={assignedBy} onChange={e => setAssignedBy(e.target.value)} required placeholder="Your name" />
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={closeForm}>Cancel</button>
                  <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                    {isSubmitting ? "Assigning..." : "Assign Task"}
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