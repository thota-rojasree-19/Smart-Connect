import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket.js";
import EmojiPicker from "emoji-picker-react";
import "../styles/GroupChat.css";

export default function GroupChat(){
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [groupName, setGroupName] = useState("Group Chat");
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [groupMembersCount, setGroupMembersCount] = useState(0);
  const me = sessionStorage.getItem("email");
  const endRef = useRef(null);
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const emojiRef = useRef(null);

  useEffect(()=> {
    const fetchMessages = async () => {
      try {
        setLoading(true);
<<<<<<< HEAD
        const res = await fetch(`https://smart-connect-backend-eu0p.onrender.com/api/groups/${groupId}/messages`);
=======
        const res = await fetch(`http://localhost:5000/api/groups/${groupId}/messages`);
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
        const data = await res.json();
  setMessages(data || []);
  // after messages load, ensure we scroll to the most recent message
  setTimeout(() => scrollToBottom('auto'), 50);
        try {
<<<<<<< HEAD
          const infoRes = await fetch(`https://smart-connect-backend-eu0p.onrender.com/api/groups/${groupId}/info`);
=======
          const infoRes = await fetch(`http://localhost:5000/api/groups/${groupId}/info`);
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
          if (infoRes.ok) {
            const info = await infoRes.json();
            setGroupName(info.name || "Group Chat");
            setGroupImage(info.image || null);
            setGroupMembersCount(info.members?.length || 0);
          }
        } catch (e) {
          console.warn("Failed to fetch group info", e);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [groupId]);

  useEffect(() => {
    if (!groupId || !me) return;
    const markSeen = async () => {
      try {
        console.log(`[GroupChat] Marking messages seen for groupId=${groupId}, email=${me}`);
<<<<<<< HEAD
        const res = await fetch(`https://smart-connect-backend-eu0p.onrender.com/api/groups/${groupId}/mark-seen`, {
=======
        const res = await fetch(`http://localhost:5000/api/groups/${groupId}/mark-seen`, {
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: me })
        });
        if (res.ok) {
          const updated = await res.json();
          console.log(`[GroupChat] mark-seen success: ${updated.length} messages returned`);
          setMessages(updated || []);
        } else {
          console.warn(`[GroupChat] mark-seen returned non-OK status: ${res.status}`);
        }
      } catch (e) {
        console.warn(`[GroupChat] Failed to mark seen:`, e.message);
      }
    };
    markSeen();
  }, [groupId, me]);

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const email = sessionStorage.getItem("email");
        if (!email) return;
<<<<<<< HEAD
        const res = await fetch(`https://smart-connect-backend-eu0p.onrender.com/api/groups/my?email=${encodeURIComponent(email)}`);
=======
        const res = await fetch(`http://localhost:5000/api/groups/my?email=${encodeURIComponent(email)}`);
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
        if (!res.ok) return;
        const data = await res.json();
        setGroups(data || []);
      } catch (err) {
        console.error("Error fetching my groups:", err);
      }
    };
    fetchMyGroups();
  }, []);

  useEffect(() => {
    const handler = (msg) => {
      try {
        if (String(msg.groupId) === String(groupId)) {
          setMessages(prev => {
            if (prev.some(m => m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        }
      } catch (e) {
        setMessages(prev => {
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
      (async () => {
        try {
<<<<<<< HEAD
          await fetch(`https://smart-connect-backend-eu0p.onrender.com/api/groups/${groupId}/mark-seen`, {
=======
          await fetch(`http://localhost:5000/api/groups/${groupId}/mark-seen`, {
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: me })
          });
        } catch (e) { }
      })();
    };
    socket.on("receiveGroupMessage", handler);
    return () => socket.off("receiveGroupMessage", handler);
  }, [groupId, me]);

  useEffect(()=> endRef.current?.scrollIntoView({behavior:"smooth"}), [messages]);
  
  // helper to scroll to bottom (most recent message)
  const scrollToBottom = (behavior = "smooth") => {
    try {
      // prefer scrolling the container if available for better control
      const container = document.querySelector('.messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
        return;
      }
      endRef.current?.scrollIntoView({ behavior });
    } catch (e) { /* ignore */ }
  };

  // Hide global navbar/footer while this page is mounted
  useEffect(() => {
    document.body.classList.add("no-shell");
    return () => document.body.classList.remove("no-shell");
  }, []);

  // Group edit modal state
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalImageFile, setModalImageFile] = useState(null);
  const [modalImagePreview, setModalImagePreview] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberEmailToAdd, setMemberEmailToAdd] = useState("");
  const [originalMembers, setOriginalMembers] = useState([]);

  // open modal and populate fields
  const openGroupModal = async () => {
    try {
<<<<<<< HEAD
      const res = await fetch(`https://smart-connect-backend-eu0p.onrender.com/api/groups/${groupId}/info`);
=======
      const res = await fetch(`http://localhost:5000/api/groups/${groupId}/info`);
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
      if (!res.ok) return;
      const info = await res.json();
      setModalName(info.name || "");
      setModalImagePreview(info.image || null);
      setIsAdmin(info.admin && info.admin.email === me);
      // keep members in local state so we can add/remove in UI
      setGroups(prev => {
        const found = (prev || []).some(g => g._id === info._id);
        if (found) return prev.map(g => g._id === info._id ? info : g);
        return [info, ...(prev || [])];
      });
      setOriginalMembers((info.members || []).map(m => m.email));
      setShowGroupModal(true);
    } catch (e) {
      console.error("Failed to open group modal", e);
    }
  };

  const handleModalImageSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setModalImageFile(f);
    const url = URL.createObjectURL(f);
    setModalImagePreview(url);
  };

  const addMemberLocal = () => {
    if (!memberEmailToAdd.trim()) return;
    const email = memberEmailToAdd.trim();
    setGroups(prev => prev.map(g => {
      if (g._id !== groupId) return g;
      const already = g.members?.some(m => m.email === email);
      const newMember = { email, name: email };
      return { ...g, members: already ? g.members : [...(g.members||[]), newMember] };
    }));
    setMemberEmailToAdd("");
  };

  const removeMemberLocal = (email) => {
    setGroups(prev => prev.map(g => g._id === groupId ? { ...g, members: g.members.filter(m => m.email !== email) } : g));
  };

  const saveGroupChanges = async () => {
    try {
      const form = new FormData();
      form.append('adminEmail', me);
      form.append('name', modalName);
      if (modalImageFile) form.append('image', modalImageFile);
      // compute added and removed emails by comparing current groups entry with server copy
  const currentGroup = groups.find(g => g._id === groupId) || { members: [] };
  const currentMembers = (currentGroup.members || []).map(m => m.email);
  const addEmails = currentMembers.filter(e => !originalMembers.includes(e));
  const removeEmails = originalMembers.filter(e => !currentMembers.includes(e));
  form.append('addMemberEmails', JSON.stringify(addEmails));
  form.append('removeMemberEmails', JSON.stringify(removeEmails));

<<<<<<< HEAD
      const res = await fetch(`https://smart-connect-backend-eu0p.onrender.com/api/groups/${groupId}/update`, {
=======
      const res = await fetch(`http://localhost:5000/api/groups/${groupId}/update`, {
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (res.ok) {
        setGroupName(data.group.name || groupName);
        setGroupImage(data.group.image || groupImage);
        // update groups listing
        setGroups(prev => prev.map(g => g._id === data.group._id ? data.group : g));
        setShowGroupModal(false);
        setModalImageFile(null);
        setModalImagePreview(null);
      } else {
        alert(data.message || 'Failed to update group');
      }
    } catch (e) {
      console.error('Error saving group changes', e);
      alert('Failed to save changes');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleVoiceRecord = async () => {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
          setFile(audioFile);
          stream.getTracks().forEach(track => track.stop());
        };
        recorder.start();
        setRecording(true);
        setMediaRecorder(recorder);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access denied");
      }
    } else {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      setRecording(false);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText(prev => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const send = async () => {
    if (!text.trim() && !file) return;
    const formData = new FormData();
    formData.append("groupId", groupId);
    formData.append("senderEmail", me);
    if (text.trim()) {
      formData.append("text", text);
    }
    if (file) {
      formData.append("file", file);
    }
    try {
<<<<<<< HEAD
      const res = await fetch("https://smart-connect-backend-eu0p.onrender.com/api/groups/send", {
=======
      const res = await fetch("http://localhost:5000/api/groups/send", {
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setText("");
        setFile(null);
        const newMsg = data.message || data;
        setMessages(prev => {
          if (!newMsg || prev.some(m => m._id === newMsg._id)) return prev;
          return [...prev, newMsg];
        });
      } else {
        alert(data.message || "Failed to send");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Error sending message");
    }
  };

  // Convert server-returned fileUrl (which may be relative) to an absolute URL usable by the browser.
  const toAbsolute = (u) => {
    if (!u) return u;
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
<<<<<<< HEAD
    return `https://smart-connect-backend-eu0p.onrender.com${u}`;
=======
    return `http://localhost:5000${u}`;
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
  };

  return (
    <div style={{display:"flex", height:"100vh", gap:0}}>
      <aside className="group-sidebar">
        <div className="group-sidebar-header">
          <button className="group-chat-back-btn" onClick={() => navigate("/dashboard")}><i className="fa-solid fa-arrow-left"></i></button>
          <div className="group-sidebar-title">My Groups</div>
        </div>
        <div className="group-list">
          {groups.length === 0 && <div className="no-groups">No groups yet. Create one from Groups page.</div>}
          {groups.map(g => (
            <div key={g._id} className={`group-item ${g._id===groupId? 'active':''}`} onClick={() => navigate(`/group/${g._id}`)}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                {g.image ? (
                  <img src={g.image} alt="grp" style={{width:44,height:44,objectFit:'cover',borderRadius:8}} />
                ) : (
                  <div style={{width:44,height:44,background:'#eee',borderRadius:8}} />
                )}
                <div style={{display:'flex',flexDirection:'column'}}>
                  <div className="group-item-name">{g.name || '(no name)'}</div>
                  <div className="group-item-meta">{g.members?.map(m => m.name || m.email).slice(0,3).join(", ")}{g.members?.length>3 ? ` +${g.members.length-3}` : ""}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div style={{flex:1, display:"flex", flexDirection:"column"}}>
        <div className="group-chat-header" style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{paddingLeft:16}} />
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            {groupImage ? (
              <img src={groupImage} alt="grp" style={{width:44,height:44,objectFit:'cover',borderRadius:8}} onClick={openGroupModal} />
            ) : (
              <div style={{width:44,height:44,background:'#ffffff44',borderRadius:8}} onClick={openGroupModal} />
            )}
            <div className="group-chat-title" style={{paddingLeft:8}}>
              <h1 style={{margin:0}} onClick={openGroupModal}>{groupName}</h1>
              <p style={{margin:0}}>{messages.length} messages</p>
            </div>
          </div>
          <div style={{marginLeft:'auto', paddingRight:16}}>
            <button className="group-chat-back-btn" title="Create Group" onClick={() => navigate('/groups')}>＋</button>
          </div>
        </div>

        <div className="messages-container">
          {loading ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">⏳</div>
              <div className="empty-chat-text">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">💬</div>
              <div className="empty-chat-text">No messages yet. Start the conversation!</div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={m._id || i}
                className={`message-bubble ${m.senderId?.email === me ? 'sent' : 'received'}`}
              >
                <div className="message-text">
                  <span className="sender-prefix">{m.senderId?.name || m.senderId?.email}:</span>
                  <span className="message-body"> {m.text}</span>
                </div>

                {m.fileUrl && (
                  <div style={{marginTop: 8}}>
                    {m.fileType === "image" && (
                      <img
                        src={toAbsolute(m.fileUrl)}
                        alt="shared"
                        style={{maxWidth: 200, borderRadius: 8}}
                        onError={(e) => {
                          console.error("Failed to load image:", toAbsolute(m.fileUrl));
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    {m.fileType === "audio" && (
                      <audio controls style={{width: 200}} src={toAbsolute(m.fileUrl)} />
                    )}
                    {m.fileType === "pdf" && (
                      <a href={toAbsolute(m.fileUrl)} target="_blank" rel="noopener noreferrer" className="file-link">
                        📄 {m.fileName}
                      </a>
                    )}
                    {m.fileType === "text" && (
                      <a href={toAbsolute(m.fileUrl)} target="_blank" rel="noopener noreferrer" className="file-link">
                        📎 {m.fileName}
                      </a>
                    )}
                  </div>
                )}

                <div style={{display:'flex',alignItems:'center',gap:8,justifyContent: m.senderId?.email===me ? 'flex-end' : 'flex-start'}}>
                  <div className="message-time">
                    {new Date(m.createdAt).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}
                  </div>
                  
                  {m.senderId?.email === me && (
                    <>
                      {m.seenBy && groupMembersCount && m.seenBy.length >= groupMembersCount ? (
                        <div className="ticks seenAll" title={`Seen by all ${groupMembersCount} members`}>
                          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 6L5 10L11 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 6L11 10L17 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="ticks notSeen" title={`Seen by ${m.seenBy?.length || 0}/${groupMembersCount || 0}`}>
                          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 6L5 10L11 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 6L11 10L17 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        {showGroupModal && (
          <div className="group-modal-backdrop" onClick={() => setShowGroupModal(false)}>
            <div className="group-modal" onClick={e => e.stopPropagation()}>
              <h3>Edit Group</h3>
              <div className="form-row">
                <img src={modalImagePreview || '/vite.svg'} alt="preview" style={{width:60,height:60,objectFit:'cover',borderRadius:8}} />
                <input type="file" accept="image/*" onChange={handleModalImageSelect} />
              </div>
              <div className="form-row">
                <input type="text" value={modalName} onChange={e => setModalName(e.target.value)} placeholder="Group name" />
              </div>

              {isAdmin && (
                <>
                  <div style={{marginTop:8}}>Members</div>
                  <div className="members-list">
                    {(groups.find(g => g._id===groupId)?.members || []).map(m => (
                      <div key={m.email} className="member-item">
                        <div>{m.name || m.email}</div>
                        <div>
                          <button className="btn secondary" onClick={() => removeMemberLocal(m.email)}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="form-row" style={{marginTop:8}}>
                    <input type="text" value={memberEmailToAdd} onChange={e => setMemberEmailToAdd(e.target.value)} placeholder="Email to add" />
                    <button className="btn primary" onClick={addMemberLocal}>Add</button>
                  </div>
                </>
              )}

              <div className="actions">
                <button className="btn secondary" onClick={() => setShowGroupModal(false)}>Cancel</button>
                {isAdmin && (
                  <button
                    className="btn danger"
                    onClick={async () => {
                      if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;
                      try {
                        // send adminEmail as query param to avoid issues where some servers
                        // don't handle DELETE bodies consistently; also handle non-JSON responses
<<<<<<< HEAD
                        const url = `https://smart-connect-backend-eu0p.onrender.com/api/groups/${groupId}?adminEmail=${encodeURIComponent(me)}`;
=======
                        const url = `http://localhost:5000/api/groups/${groupId}?adminEmail=${encodeURIComponent(me)}`;
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
                        const res = await fetch(url, { method: 'DELETE' });
                        // Read body as text once, then try to parse JSON. This avoids
                        // "body stream already read" when calling res.json() then res.text().
                        const bodyText = await res.text();
                        let data = null;
                        if (bodyText) {
                          try {
                            data = JSON.parse(bodyText);
                          } catch (err) {
                            console.error('Non-JSON response deleting group:', bodyText);
                            alert('Failed to delete group: unexpected server response');
                            return;
                          }
                        }
                        if (res.ok) {
                          // remove group locally and navigate away
                          setShowGroupModal(false);
                          setGroups(prev => (prev || []).filter(g => g._id !== groupId));
                          navigate('/groups');
                        } else {
                          alert((data && data.message) || `Failed to delete group (status ${res.status})`);
                        }
                      } catch (e) {
                        console.error('Error deleting group', e);
                        alert('Failed to delete group');
                      }
                    }}
                  >
                    Delete Group
                  </button>
                )}
                <button className="btn primary" onClick={saveGroupChanges}>Save</button>
              </div>
            </div>
          </div>
        )}

        <div className="input-area">
          <label className="upload-btn">
            +
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/*,application/pdf,audio/*"
              onChange={handleFileSelect}
            />
          </label>

          {showEmojiPicker && (
            <div className="emoji-picker-popup" ref={emojiRef}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                emojiStyle="native"
                theme="light"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                }}
              />
            </div>
          )}

          <button
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Add emoji"
          >
            😊
          </button>

          <input 
            className="message-input"
            value={file ? `Selected: ${file.name}` : text}
            onChange={e => !file && setText(e.target.value)}
            disabled={!!file}
            onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} 
            placeholder={file ? `Selected: ${file.name}` : "Type a message..."}
          />

          <button
            className={`mic-btn ${recording ? "recording" : ""}`}
            onClick={handleVoiceRecord}
            title={recording ? "Stop Recording" : "Record Voice"}
          >
            🎤
          </button>

          <button 
            className="send-btn"
            onClick={send}
            title="Send message"
            disabled={!text.trim() && !file}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}