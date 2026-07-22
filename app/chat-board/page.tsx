"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './ChatBoard.module.css';

// --- FIREBASE IMPORTS ---
import { 
  collection, addDoc, onSnapshot, query, orderBy, 
  doc, updateDoc, deleteDoc, serverTimestamp, where 
} from 'firebase/firestore';
import { db } from "@/src/firebase"; 

// --- TYPESCRIPT INTERFACES ---
interface ChatUser {
  name: string;
  position: string;
  color: string;
}

interface ChatSession {
  id: string;
  title: string;
  startTime: string; 
  endTime: string;   
  createdAt?: any;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  text: string;
  senderName: string;
  senderPosition: string;
  senderColor: string;
  isPinned: boolean;
  isEdited: boolean;
  createdAt?: any;
}

const USER_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#0ea5e9'];

export default function ChatBoard() {
  const [user, setUser] = useState<ChatUser | null>(null);
  const [loginName, setLoginName] = useState("");
  const [loginPosition, setLoginPosition] = useState("");

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionStart, setNewSessionStart] = useState("");
  const [newSessionEnd, setNewSessionEnd] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  
  // NEW STATE: Members Modal
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 1. INITIALIZE USER & SESSIONS ---
  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) setUser(JSON.parse(savedUser));

    const q = query(collection(db, "chatSessions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: ChatSession[] = [];
      snapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() } as ChatSession));
      setSessions(fetched);
      if (fetched.length > 0 && !activeSessionId) {
        setActiveSessionId(fetched[0].id);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- 2. FETCH MESSAGES (FIXED FOR FIREBASE INDEXING) ---
  useEffect(() => {
    if (!activeSessionId) return;

    // Removed orderBy to prevent Firebase Composite Index errors. 
    // We will sort them in JavaScript instead.
    const q = query(
      collection(db, "chatMessages"), 
      where("sessionId", "==", activeSessionId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: ChatMessage[] = [];
      snapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() } as ChatMessage));
      
      // Client-side sorting based on timestamp
      fetched.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
        return timeA - timeB;
      });

      setMessages(fetched);
      
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, [activeSessionId]);

  // --- IDENTITY LOGIN ---
  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName || !loginPosition) return;
    
    const randomColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
    const newUser = { name: loginName, position: loginPosition, color: randomColor };
    
    setUser(newUser);
    localStorage.setItem('chatUser', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chatUser');
  };

  // --- SESSION MANAGEMENT ---
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle || !newSessionStart || !newSessionEnd) return;
    try {
      const docRef = await addDoc(collection(db, "chatSessions"), {
        title: newSessionTitle,
        startTime: newSessionStart,
        endTime: newSessionEnd,
        createdAt: serverTimestamp()
      });
      setActiveSessionId(docRef.id);
      setIsNewSessionModalOpen(false);
      setNewSessionTitle(""); setNewSessionStart(""); setNewSessionEnd("");
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this entire chat session?")) {
      await deleteDoc(doc(db, "chatSessions", id));
      if (activeSessionId === id) setActiveSessionId(null);
    }
  };

  const handleRenameSession = async (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTitle = window.prompt("Enter new session name:", currentTitle);
    if (newTitle && newTitle.trim() !== "") {
      await updateDoc(doc(db, "chatSessions", id), { title: newTitle });
    }
  };

  // --- MESSAGE MANAGEMENT ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeSessionId) return;

    if (editingMessageId) {
      await updateDoc(doc(db, "chatMessages", editingMessageId), {
        text: newMessage,
        isEdited: true
      });
      setEditingMessageId(null);
    } else {
      await addDoc(collection(db, "chatMessages"), {
        sessionId: activeSessionId,
        text: newMessage,
        senderName: user.name,
        senderPosition: user.position,
        senderColor: user.color,
        isPinned: false,
        isEdited: false,
        createdAt: serverTimestamp()
      });
    }
    setNewMessage("");
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm("Delete this message?")) await deleteDoc(doc(db, "chatMessages", id));
  };

  const handleTogglePin = async (id: string, currentPinStatus: boolean) => {
    await updateDoc(doc(db, "chatMessages", id), { isPinned: !currentPinStatus });
  };

  const startEditing = (msg: ChatMessage) => {
    setEditingMessageId(msg.id);
    setNewMessage(msg.text);
  };

  // --- EXTRACT UNIQUE MEMBERS ---
  const getUniqueMembers = () => {
    const unique = new Map();
    messages.forEach(msg => {
      if (!unique.has(msg.senderName)) {
        unique.set(msg.senderName, {
          name: msg.senderName,
          position: msg.senderPosition,
          color: msg.senderColor
        });
      }
    });
    return Array.from(unique.values());
  };
  const sessionMembers = getUniqueMembers();

  // --- TIMELINE LOGIC ---
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const isChatActive = () => {
    if (!activeSession) return false;
    const now = new Date().getTime();
    const start = new Date(activeSession.startTime).getTime();
    const end = new Date(activeSession.endTime).getTime();
    return now >= start && now <= end;
  };

  const chatAllowed = isChatActive();
  const pinnedMessages = messages.filter(m => m.isPinned);

  // --- RENDER GATE ---
  if (!user) {
    return (
      <div className={styles.gateWrapper}>
        <div className={styles.gateCard}>
          <h2>👋 Join Team Chat</h2>
          <p>Please identify yourself before joining the discussion.</p>
          <form onSubmit={handleJoinChat} className={styles.gateForm}>
            <input type="text" placeholder="Your Name (e.g. Prathamesh)" value={loginName} onChange={e => setLoginName(e.target.value)} required />
            <input type="text" placeholder="Your Position (e.g. Team Leader)" value={loginPosition} onChange={e => setLoginPosition(e.target.value)} required />
            <button type="submit">Enter Chat</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      
      {/* HEADER NAV */}
      <header className={styles.topNav}>
        <div className={styles.navLeft}>
          <Link href="/" className={styles.backBtn}>← Dashboard</Link>
          <h1 className={styles.title}>💬 Team Comms</h1>
        </div>
        <div className={styles.navRight}>
          <div className={styles.userInfoBadge} style={{ borderColor: user.color }}>
            <span className={styles.userDot} style={{ background: user.color }}></span>
            {user.name} ({user.position})
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>Leave</button>
        </div>
      </header>

      <div className={styles.chatContainer}>
        
        {/* SIDEBAR: SESSIONS */}
        <aside className={styles.sidebar}>
          <button className={styles.newSessionBtn} onClick={() => setIsNewSessionModalOpen(true)}>
            + New Chat Session
          </button>
          
          <div className={styles.sessionList}>
            <h3 className={styles.sidebarTitle}>Recent Sessions</h3>
            {sessions.map(session => (
              <div 
                key={session.id} 
                className={`${styles.sessionItem} ${activeSessionId === session.id ? styles.activeSession : ''}`}
                onClick={() => setActiveSessionId(session.id)}
              >
                <div className={styles.sessionInfo}>
                  <span className={styles.sessionName}>{session.title}</span>
                  <span className={styles.sessionTime}>
                    {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(session.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className={styles.sessionActions}>
                  <button onClick={(e) => handleRenameSession(session.id, session.title, e)} title="Rename">✏️</button>
                  <button onClick={(e) => handleDeleteSession(session.id, e)} title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <main className={styles.chatArea}>
          {activeSession ? (
            <>
              {/* CHAT HEADER WITH MEMBERS BUTTON */}
              <div className={styles.chatHeader}>
                <div className={styles.headerTitleGroup}>
                  <h2>{activeSession.title}</h2>
                  <div className={styles.timelineBadge}>
                    {chatAllowed ? <span className={styles.livePulse}></span> : <span>🔒</span>}
                    {chatAllowed ? "Session Live" : "Session Closed"}
                  </div>
                </div>
                <button className={styles.membersBtn} onClick={() => setIsMembersModalOpen(true)}>
                  👥 Members ({sessionMembers.length})
                </button>
              </div>

              {/* PINNED MESSAGES */}
              {pinnedMessages.length > 0 && (
                <div className={styles.pinnedBanner}>
                  <strong>📌 Pinned:</strong>
                  <div className={styles.pinnedList}>
                    {pinnedMessages.map(pm => (
                      <div key={`pin-${pm.id}`} className={styles.pinnedItem}>
                        <span>{pm.senderName}:</span> {pm.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MESSAGES FEED */}
              <div className={styles.messagesFeed}>
                {messages.length === 0 ? (
                  <div className={styles.noMessages}>Start the conversation...</div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.senderName === user.name;
                    return (
                      <div key={msg.id} className={`${styles.messageWrapper} ${isMine ? styles.mine : styles.theirs}`}>
                        <div className={styles.messageBubble} style={{ borderTopColor: isMine ? 'transparent' : msg.senderColor }}>
                          
                          <div className={styles.msgHeader}>
                            <strong style={{ color: isMine ? '#ffffff' : msg.senderColor }}>
                              {msg.senderName} <span className={styles.msgPosition}>({msg.senderPosition})</span>
                            </strong>
                          </div>
                          
                          <p className={styles.msgText}>{msg.text}</p>
                          
                          <div className={styles.msgFooter}>
                            <span className={styles.msgTime}>
                              {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Sending...'} 
                              {msg.isEdited && " (edited)"}
                            </span>
                            
                            <div className={styles.msgActions}>
                              <button onClick={() => handleTogglePin(msg.id, msg.isPinned)} title="Pin Message">
                                {msg.isPinned ? '📍 Unpin' : '📌 Pin'}
                              </button>
                              {isMine && (
                                <>
                                  <button onClick={() => startEditing(msg)} title="Edit">✏️</button>
                                  <button onClick={() => handleDeleteMessage(msg.id)} title="Delete">🗑️</button>
                                </>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* MESSAGE INPUT */}
              <div className={styles.chatInputArea}>
                {!chatAllowed ? (
                  <div className={styles.closedWarning}>
                    This chat session is currently closed. (Timeline: {new Date(activeSession.startTime).toLocaleString()} to {new Date(activeSession.endTime).toLocaleString()})
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className={styles.inputForm}>
                    {editingMessageId && <span className={styles.editingBadge}>Editing message... <button type="button" onClick={() => {setEditingMessageId(null); setNewMessage("");}}>✕</button></span>}
                    <div className={styles.inputWrapper}>
                      <input 
                        type="text" 
                        value={newMessage} 
                        onChange={e => setNewMessage(e.target.value)} 
                        placeholder="Type a message..." 
                        required 
                      />
                      <button type="submit" className={styles.sendBtn}>
                        {editingMessageId ? 'Update' : 'Send ➔'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className={styles.noSessionSelected}>
              <h2>No Session Selected</h2>
              <p>Select a session from the sidebar or create a new one to start chatting.</p>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: NEW SESSION */}
      {isNewSessionModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsNewSessionModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>Create Chat Session</h2>
            <p>Set a timeline for when team members are allowed to send messages in this session.</p>
            <form onSubmit={handleCreateSession} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Session Name (e.g., Daily Standup)</label>
                <input type="text" value={newSessionTitle} onChange={e => setNewSessionTitle(e.target.value)} required />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Start Time</label>
                  <input type="datetime-local" value={newSessionStart} onChange={e => setNewSessionStart(e.target.value)} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>End Time</label>
                  <input type="datetime-local" value={newSessionEnd} onChange={e => setNewSessionEnd(e.target.value)} required />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsNewSessionModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryBtn}>Create Session</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW MEMBERS */}
      {isMembersModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsMembersModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeaderFlex}>
              <h2>Session Members</h2>
              <button className={styles.closeIconBtn} onClick={() => setIsMembersModalOpen(false)}>✕</button>
            </div>
            <p>People who have participated in this chat session.</p>
            
            <div className={styles.membersList}>
              {sessionMembers.length === 0 ? (
                <div className={styles.noMembersText}>No one has sent a message yet.</div>
              ) : (
                sessionMembers.map((member, index) => (
                  <div key={index} className={styles.memberListItem}>
                    <div className={styles.memberAvatar} style={{ backgroundColor: member.color }}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.memberInfo}>
                      <strong>{member.name} {member.name === user.name && "(You)"}</strong>
                      <span>{member.position}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}