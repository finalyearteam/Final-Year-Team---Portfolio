"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './PresentationBoard.module.css';

// --- FIREBASE IMPORTS ---
import { 
  collection, addDoc, onSnapshot, query, orderBy, 
  doc, updateDoc, deleteDoc, serverTimestamp 
} from 'firebase/firestore';
import { db } from "@/src/firebase"; 

// --- TYPESCRIPT INTERFACES ---
interface Attachment {
  title: string;
  url: string;
}

interface Presentation {
  id: string;
  title: string;
  description: string;
  primaryLink: string;
  creators: string;
  presenters: string;
  socialHandles: string;
  attachments: Attachment[];
  createdAt?: any;
}

export default function PresentationBoard() {
  // --- UI & DATA STATES ---
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- MODAL & FORM STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [primaryLink, setPrimaryLink] = useState("");
  const [creators, setCreators] = useState("");
  const [presenters, setPresenters] = useState("");
  const [socialHandles, setSocialHandles] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const q = query(collection(db, "presentations"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Presentation[] = [];
      snapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() } as Presentation));
      setPresentations(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. DYNAMIC ATTACHMENTS LOGIC ---
  const handleAddAttachmentRow = () => {
    setAttachments([...attachments, { title: "", url: "" }]);
  };

  const handleUpdateAttachment = (index: number, field: keyof Attachment, value: string) => {
    const newAttachments = [...attachments];
    newAttachments[index][field] = value;
    setAttachments(newAttachments);
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
  };

  // --- 3. SUBMIT FORM (CREATE OR EDIT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !primaryLink) return;
    setIsSubmitting(true);

    // Clean empty attachments before saving
    const cleanedAttachments = attachments.filter(a => a.title.trim() !== "" && a.url.trim() !== "");

    const payload = {
      title,
      description,
      primaryLink,
      creators,
      presenters,
      socialHandles,
      attachments: cleanedAttachments,
    };

    try {
      if (editingId) {
        // Update existing
        await updateDoc(doc(db, "presentations", editingId), payload);
      } else {
        // Create new
        await addDoc(collection(db, "presentations"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving presentation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. DELETE & EDIT HANDLERS ---
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this presentation?")) {
      await deleteDoc(doc(db, "presentations", id));
    }
  };

  const openEditModal = (pres: Presentation) => {
    setEditingId(pres.id);
    setTitle(pres.title);
    setDescription(pres.description);
    setPrimaryLink(pres.primaryLink);
    setCreators(pres.creators);
    setPresenters(pres.presenters);
    setSocialHandles(pres.socialHandles || "");
    setAttachments(pres.attachments || []);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPrimaryLink("");
    setCreators("");
    setPresenters("");
    setSocialHandles("");
    setAttachments([]);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.backBtn}>← Back</Link>
            <h1 className={styles.title}>📽️ Presentation & Assets</h1>
          </div>
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            + Add Presentation
          </button>
        </header>

        {/* FEED */}
        <main className={styles.feed}>
          {isLoading ? (
            <div className={styles.emptyState}>Loading presentations...</div>
          ) : presentations.length === 0 ? (
            <div className={styles.emptyState}>No presentations added yet.</div>
          ) : (
            <div className={styles.grid}>
              {presentations.map((pres) => (
                <div key={pres.id} className={styles.card}>
                  
                  <div className={styles.cardHeader}>
                    <h2 className={styles.presTitle}>{pres.title}</h2>
                    <div className={styles.actionButtons}>
                      <button onClick={() => openEditModal(pres)} title="Edit">✏️</button>
                      <button onClick={() => handleDelete(pres.id)} title="Delete" className={styles.deleteBtn}>🗑️</button>
                    </div>
                  </div>

                  <p className={styles.description}>{pres.description}</p>

                  <div className={styles.rolesGrid}>
                    <div className={styles.roleBox}>
                      <span>🎨 Created By</span>
                      <strong>{pres.creators || "Unassigned"}</strong>
                    </div>
                    <div className={styles.roleBox}>
                      <span>🎤 Presented By</span>
                      <strong>{pres.presenters || "Unassigned"}</strong>
                    </div>
                  </div>

                  {/* LINKS SECTION */}
                  <div className={styles.linksSection}>
                    <a href={pres.primaryLink} target="_blank" rel="noopener noreferrer" className={styles.primaryLinkBtn}>
                      🔗 Open Main Presentation
                    </a>

                    {pres.attachments && pres.attachments.length > 0 && (
                      <div className={styles.attachmentsList}>
                        <strong>📎 Additional Attachments:</strong>
                        {pres.attachments.map((att, i) => (
                          <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className={styles.attachmentItem}>
                            • {att.title}
                          </a>
                        ))}
                      </div>
                    )}

                    {pres.socialHandles && (
                      <div className={styles.socialBox}>
                        <strong>📱 Social Media & Handles:</strong>
                        <p>{pres.socialHandles}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* MODAL: ADD / EDIT */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2>{editingId ? "Edit Presentation" : "Add New Presentation"}</h2>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                
                <div className={styles.inputGroup}>
                  <label>Project / Presentation Title *</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Final Year AI Project"/>
                </div>

                <div className={styles.inputGroup}>
                  <label>About this Presentation *</label>
                  <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} required placeholder="Briefly describe what this presentation covers..."/>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Who will make/create it?</label>
                    <input type="text" value={creators} onChange={e => setCreators(e.target.value)} placeholder="e.g. Pratham, Sumit" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Who will present it?</label>
                    <input type="text" value={presenters} onChange={e => setPresenters(e.target.value)} placeholder="e.g. Anagha, Snehal" />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Primary Presentation Link * (Canva, Google Slides, etc.)</label>
                  <input type="url" value={primaryLink} onChange={e => setPrimaryLink(e.target.value)} required placeholder="https://..." />
                </div>

                {/* DYNAMIC ATTACHMENTS */}
                <div className={styles.attachmentSection}>
                  <div className={styles.attachmentHeader}>
                    <label>Additional Attachments (Docs, Videos, Assets)</label>
                    <button type="button" onClick={handleAddAttachmentRow} className={styles.addAttBtn}>+ Add Link</button>
                  </div>
                  
                  {attachments.map((att, index) => (
                    <div key={index} className={styles.attachmentRow}>
                      <input 
                        type="text" 
                        placeholder="Link Title (e.g. Figma UI)" 
                        value={att.title} 
                        onChange={e => handleUpdateAttachment(index, 'title', e.target.value)} 
                      />
                      <input 
                        type="url" 
                        placeholder="https://..." 
                        value={att.url} 
                        onChange={e => handleUpdateAttachment(index, 'url', e.target.value)} 
                      />
                      <button type="button" onClick={() => handleRemoveAttachment(index)} className={styles.removeAttBtn}>✕</button>
                    </div>
                  ))}
                </div>

                <div className={styles.inputGroup}>
                  <label>Social Media Handles / Project Links</label>
                  <textarea rows={2} value={socialHandles} onChange={e => setSocialHandles(e.target.value)} placeholder="e.g. Instagram: @project_name, GitHub repo link..."/>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : editingId ? "Update Presentation" : "Save Presentation"}
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