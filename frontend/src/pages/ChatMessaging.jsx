import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChatMessaging.css";
import defaultImg from "../assets/default.jpeg"; // default image
import EmojiPicker from "emoji-picker-react";
import socket from "../socket.js";
<<<<<<< HEAD
import axios from "axios";
=======
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203


const ChatMessaging = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const BASE_URL = "https://smart-connect-backend-eu0p.onrender.com"; // adjust for deployment
=======
  const BASE_URL = "http://localhost:5000"; // adjust for deployment
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
  const messagesEndRef = useRef(null);
  const selectedMessageRef = useRef(null);
  const [friends, setFriends] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [file, setFile] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
<<<<<<< HEAD
  const [replyTo, setReplyTo] = useState(null);
=======
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [selectedShareFriends, setSelectedShareFriends] = useState([]);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const currentUser = sessionStorage.getItem("email");
<<<<<<< HEAD
  
=======
  // const [smartSuggestions, setSmartSuggestions] = useState([]);
  // const [lastSuggestedMsgId, setLastSuggestedMsgId] = useState(null);
  // const [isSuggesting, setIsSuggesting] = useState(false);
  // const [suggestionError, setSuggestionError] = useState(null);

// const getSmartReplies = async (lastMessage) => {
//   try {
//     const res = await axios.post("http://localhost:5000/api/ai-suggestions", {
//       lastMessage,
//     });
//     return res.data.suggestions || [];
//   } catch (err) {
//     console.error("AI suggestion error:", err);
//     return [];
//   }
// };

// useEffect(() => {
//   if (selectedFriend && messages[selectedFriend]?.length > 0) {
//     const lastMsg =
//       messages[selectedFriend][messages[selectedFriend].length - 1];
//     if (lastMsg?.text) {
//       getSmartReplies(lastMsg.text).then(setSmartSuggestions);
//     }
//   } else {
//     setSmartSuggestions([]); // clear when no messages
//   }
// }, [messages, selectedFriend]);


// useEffect(() => {
//   if (messages.length > 0) {
//     const last = messages[messages.length - 1].text;
//     getSmartReplies(last).then(setSmartSuggestions);
//   }
// }, [messages]);


// const getSmartReplies = async (lastMessage) => {
//   try {
//     console.log("🔵 Requesting suggestions for:", lastMessage);
//     const res = await axios.post(
//       "http://localhost:5000/api/ai-suggestion",
//       { lastMessage }
//     );
//     console.log("🟢 AI response:", res.data);
//     return res.data.suggestions || [];
//   } catch (err) {
//     console.error("❌ AI suggestion error:", err);
//     return [];
//   }
// };

// useEffect(() => {
//   if (selectedFriend && messages[selectedFriend]?.length > 0) {
//     const lastMsg =
//       messages[selectedFriend][messages[selectedFriend].length - 1];
//     if (lastMsg?.text) {
//       getSmartReplies(lastMsg.text).then(setSmartSuggestions);
//     }
//   } else {
//     setSmartSuggestions([]); // clear when no messages
//   }
// }, [messages, selectedFriend]);


// ⚠️ Disabled older version — replaced with a safer startup effect below

// Ensure suggestions are generated when opening a chat or when messages load
// useEffect(() => {
//   if (!selectedFriend) return;

//   const msgs = messages[selectedFriend] || [];
//   if (msgs.length === 0) return;

//   // find last message from the other user
//   const currentUserEmail = (sessionStorage.getItem("email") || "").toLowerCase().trim();
//   const msgList = [...msgs].reverse();
//   const lastReceivedMsg = msgList.find((msg) => {
//     const senderEmail = (
//       (msg.senderEmail || (msg.senderId && msg.senderId.email) || msg.senderId) + ""
//     ).toLowerCase().trim();
//     return senderEmail && senderEmail !== currentUserEmail;
//   });

//   if (!lastReceivedMsg || !lastReceivedMsg.text) {
//     // nothing to suggest for
//     return;
//   }

//   // avoid refetching for same message
//   if (lastSuggestedMsgId && lastSuggestedMsgId === (lastReceivedMsg._id || lastReceivedMsg.id)) {
//     return;
//   }

//   console.log("📨 (startup) Getting suggestions for (last received):", lastReceivedMsg.text);
//   setIsSuggesting(true);
//   setSuggestionError(null);
//   getSmartReplies(lastReceivedMsg.text)
//     .then((sugg) => {
//       console.log("✅ (startup) Suggestions received:", sugg);
//       setSmartSuggestions(sugg || []);
//       setLastSuggestedMsgId(lastReceivedMsg._id || lastReceivedMsg.id || null);
//     })
//     .catch((err) => {
//       console.error("Error fetching suggestions:", err);
//       setSuggestionError(err?.message || String(err));
//     })
//     .finally(() => setIsSuggesting(false));

// }, [messages, selectedFriend]);
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  if (selectedFriend && messages[selectedFriend]) {
    scrollToBottom();
  }
}, [messages, selectedFriend]);

const handleVoiceRecord = async () => {
  if (!recording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "voice_message.webm", {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("file", audioFile);
        formData.append("senderEmail", sessionStorage.getItem("email"));
        formData.append("receiverEmail", selectedFriend);
        formData.append("text", ""); // no text for audio

        try {
<<<<<<< HEAD
          const res = await fetch("https://smart-connect-backend-eu0p.onrender.com/api/chat/send", {
=======
          const res = await fetch("http://localhost:5000/api/chat/send", {
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Failed to send");

          console.log("Audio sent successfully:", data);
<<<<<<< HEAD
=======
          // ✅ Optional: Add to messages state directly
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
          setMessages((prev) => ({
            ...prev,
            [selectedFriend]: [...(prev[selectedFriend] || []), data.data],
          }));
        } catch (err) {
          console.error("Error uploading audio:", err);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or unavailable.");
    }
  } else {
    mediaRecorder.stop();
    setRecording(false);
  }
};
<<<<<<< HEAD
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (!email) return;

    const handleConnect = () => {
      console.log("🔗 Socket connected:", socket.id);
      socket.emit("registerSocket", email);

      // Refetch friends after registering to get updated isOnline status
      setTimeout(() => {
        const fetchFriendsAfterConnect = async () => {
          try {
            const response = await fetch(
              `https://smart-connect-backend-eu0p.onrender.com/api/user/current?email=${email}`
=======

// useEffect(() => {
//   const email = sessionStorage.getItem("email");
//   if (!email) return;

//   // 👇 Only register after socket successfully connects
//   const handleConnect = () => {
//     console.log("🔗 Socket connected:", socket.id);
//     socket.emit("registerSocket", email);
    
//     // 🔄 Refetch friends after registering to get updated isOnline status
//     setTimeout(() => {
//       console.log("♻️ Refetching friends after socket registration");
//       const fetchFriendsAfterConnect = async () => {
//         try {
//           const response = await fetch(
//             `http://localhost:5000/api/user/current?email=${email}`
//           );
//           const data = await response.json();

//           const friendList = (data.friends || []).map((f) => ({
//             name: f.name,
//             email: f.email,
//             profilePic: f.profilePic && f.profilePic.trim() ? f.profilePic : null,
//             isOnline: f.isOnline || false,
//             lastSeen: f.lastSeen || null,
//           }));

//           console.log("📋 Refetched friends after connect:", friendList);
//           setFriends(friendList);
//         } catch (error) {
//           console.error("Error refetching friends after connect:", error);
//         }
//       };
      
//       fetchFriendsAfterConnect();
//     }, 500); // Wait 500ms for server to save the isOnline=true
//   };

//   socket.on("connect", handleConnect);

//   // 🔹 Handle incoming messages
//   socket.on("receiveMessage", (messageData) => {
//     console.log("📩 Message received:", messageData);
    
//     // Determine which friend this message is from
//     const friendEmail =
//       messageData.senderEmail === email
//         ? messageData.receiverEmail
//         : messageData.senderEmail;

//     console.log(`   Adding to chat with ${friendEmail}`);
    
//     // Add message to state
//     setMessages((prev) => ({
//       ...prev,
//       [friendEmail]: [...(prev[friendEmail] || []), messageData],
//     }));

//     // 🤖 ONLY fetch suggestions if this message is from the currently selected friend
//     console.log("📌 Checking: messageData.text=", messageData.text, "selectedFriend=", selectedFriend, "friendEmail=", friendEmail);
//     if (messageData.text && selectedFriend === friendEmail) {
//       console.log("🤖 ✅ Fetching AI suggestions for received message from selected friend:", messageData.text);
//       setIsSuggesting(true);
//       setSuggestionError(null);
//       getSmartReplies(messageData.text)
//         .then((sugg) => {
//           console.log("✅ Suggestions for received message:", sugg);
//           console.log("📝 Setting smartSuggestions to:", sugg);
//           setSmartSuggestions(sugg || []);
//         })
//         .catch((err) => {
//           console.error("Error fetching suggestions:", err);
//           setSuggestionError(err?.message || String(err));
//         })
//         .finally(() => setIsSuggesting(false));
//     } else {
//       console.log("❌ Skipping suggestions: text=" + !!messageData.text + ", selectedFriend matches=" + (selectedFriend === friendEmail));
//     }
//   });

//   socket.on("updateUserStatus", (data) => {
//   console.log("📢 Status update received:", data);

//   setFriends((prev) => {
//     const exists = prev.some((f) => f.email.toLowerCase() === data.email.toLowerCase());

//     if (exists) {
//       // ✅ Update existing friend
//       return prev.map((f) =>
//         f.email.toLowerCase() === data.email.toLowerCase()
//           ? { ...f, isOnline: data.isOnline, lastSeen: data.lastSeen }
//           : f
//       );
//     } else {
//       // ✅ If the user wasn't in the list yet, add them
//       return [
//         ...prev,
//         {
//           email: data.email,
//           name: data.email.split("@")[0],
//           profilePic: defaultImg,
//           isOnline: data.isOnline,
//           lastSeen: data.lastSeen,
//         },
//       ];
//     }
//   });
// });

//   return () => {
//     socket.off("connect", handleConnect);
//     socket.off("receiveMessage");
//     socket.off("updateUserStatus");
//   };
// }, [selectedFriend]);

useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (!email) return;

    // 👇 Only register after socket successfully connects
    const handleConnect = () => {
      console.log("🔗 Socket connected:", socket.id);
      socket.emit("registerSocket", email);
      
      // 🔄 Refetch friends after registering to get updated isOnline status
      setTimeout(() => {
        console.log("♻️ Refetching friends after socket registration");
        const fetchFriendsAfterConnect = async () => {
          try {
            const response = await fetch(
              `http://localhost:5000/api/user/current?email=${email}`
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
            );
            const data = await response.json();

            const friendList = (data.friends || []).map((f) => ({
              name: f.name,
              email: f.email,
              profilePic: f.profilePic && f.profilePic.trim() ? f.profilePic : null,
              isOnline: f.isOnline || false,
              lastSeen: f.lastSeen || null,
            }));

            console.log("📋 Refetched friends after connect:", friendList);
            setFriends(friendList);
          } catch (error) {
            console.error("Error refetching friends after connect:", error);
          }
        };
<<<<<<< HEAD

        fetchFriendsAfterConnect();
      }, 500);
=======
        
        fetchFriendsAfterConnect();
      }, 500); // Wait 500ms for server to save the isOnline=true
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
    };

    socket.on("connect", handleConnect);

<<<<<<< HEAD
    socket.on("receiveMessage", (messageData) => {
      console.log("📩 Message received:", messageData);

=======
    // 🔹 Handle incoming messages (AI suggestion calls removed)
    socket.on("receiveMessage", (messageData) => {
      console.log("📩 Message received:", messageData);
      
      // Determine which friend this message is from
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
      const friendEmail =
        messageData.senderEmail === email
          ? messageData.receiverEmail
          : messageData.senderEmail;

      console.log(`   Adding to chat with ${friendEmail}`);
      setMessages((prev) => ({
        ...prev,
        [friendEmail]: [...(prev[friendEmail] || []), messageData],
      }));
<<<<<<< HEAD
=======

      // NOTE: AI suggestion related logic removed intentionally
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
    });

    socket.on("updateUserStatus", (data) => {
      console.log("📢 Status update received:", data);

      setFriends((prev) => {
        const exists = prev.some((f) => f.email.toLowerCase() === data.email.toLowerCase());

        if (exists) {
<<<<<<< HEAD
=======
          // ✅ Update existing friend
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
          return prev.map((f) =>
             f.email.toLowerCase() === data.email.toLowerCase()
              ? { ...f, isOnline: data.isOnline, lastSeen: data.lastSeen }
              : f
          );
        } else {
<<<<<<< HEAD
=======
          // ✅ If the user wasn't in the list yet, add them
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
          return [
            ...prev,
            {
              email: data.email,
              name: data.email.split("@")[0],
              profilePic: defaultImg,
              isOnline: data.isOnline,
              lastSeen: data.lastSeen,
             },
          ];
        }
      });
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receiveMessage");
      socket.off("updateUserStatus");
    };
  }, [selectedFriend]);

  const handleLogout = () => {
  const email = sessionStorage.getItem("email");
  if (email) {
    try { socket.emit("userOffline", email); } catch (e) { console.warn('socket userOffline emit failed', e); }
  }
  sessionStorage.removeItem("email");
  socket.disconnect();
  setMessages({});
  navigate("/login");
};

const formatLastSeen = (dateStr) => {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Unknown";

  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const sameYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (sameDay) {
    return `Today at ${time}`;
  } else if (sameYesterday) {
    return `Yesterday at ${time}`;
  } else {
    return `${date.toLocaleDateString()} at ${time}`;
  }
};


useEffect(() => {
  if (selectedFriend) {
    const currentUserEmail = sessionStorage.getItem("email");

    fetch(
<<<<<<< HEAD
      `https://smart-connect-backend-eu0p.onrender.com/api/chat/getMessages/${currentUserEmail}/${selectedFriend}`
=======
      `http://localhost:5000/api/chat/getMessages/${currentUserEmail}/${selectedFriend}`
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
    )
      .then((res) => res.json())
      .then((data) => setMessages((prev) => ({ ...prev, [selectedFriend]: data })))
      .catch((err) => console.error("Error fetching messages:", err));
  }
}, [selectedFriend]);



  useEffect(() => {
    const handleClickOutside = () => {
      // Hide context menu and clear the hover selection when clicking anywhere outside
      setContextMenu({ visible: false, x: 0, y: 0 });
      setSelectedMessage(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);


useEffect(() => {
  const handleClickOutside = (event) => {
    if (emojiRef.current && !emojiRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleCopy = () => {
    if (selectedMessage?.text) {
      navigator.clipboard.writeText(selectedMessage.text);
      alert("Message copied!");
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleDelete = async () => {
    // Delete message from DB (optional)
    setMessages((prev) => ({
      ...prev,
      [selectedFriend]: (prev[selectedFriend] || []).filter(
        (m) => m._id !== selectedMessage._id
      ),
    }));
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleReply = () => {
<<<<<<< HEAD
    // Store the selected message as the reply target (do not prefill message text)
    setReplyTo(selectedMessage);
=======
    setNewMessage(`Replying to: ${selectedMessage.text || selectedMessage.fileName}`);
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleShare = () => {
    setShowSharePopup(true);
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

const openShareForMessage = (msgParam) => {
  const messageToShare = msgParam || selectedMessage;

  if (!messageToShare) {
    alert("No message selected to share.");
    setContextMenu({ visible: false, x: 0, y: 0 });
    return;
  }

  // ✅ Instantly store message in ref and state
  selectedMessageRef.current = messageToShare;
  setSelectedMessage(messageToShare);

  // ✅ Open popup immediately
  setShowSharePopup(true);
  setContextMenu({ visible: false, x: 0, y: 0 });
};



const handleConfirmShare = async () => {
  const msgToShare = selectedMessageRef.current || selectedMessage;

  if (!msgToShare) {
    alert("No message selected to share.");
    return;
  }

  if (!selectedShareFriends || selectedShareFriends.length === 0) {
    alert("Select at least one friend to share with.");
    return;
  }

  const senderEmail = sessionStorage.getItem("email");

  const payload = {
    senderEmail,
    recipientEmails: selectedShareFriends,
    text: msgToShare.text || undefined,
    fileUrl: msgToShare.fileUrl || undefined,
    fileType: msgToShare.fileType || undefined,
  };

  try {
<<<<<<< HEAD
    const res = await fetch("https://smart-connect-backend-eu0p.onrender.com/api/chat/share", {
=======
    const res = await fetch("http://localhost:5000/api/chat/share", {
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Share failed:", data);
      alert("Share failed: " + (data.message || "Server error"));
      return;
    }

    alert(`✅ Message shared successfully to ${selectedShareFriends.length} friend(s)!`);

    if (selectedFriend && selectedShareFriends.includes(selectedFriend)) {
      setMessages((prev) => ({
        ...prev,
        [selectedFriend]: [...(prev[selectedFriend] || []), ...data.created],
      }));
    }

    // Reset after successful share
    setShowSharePopup(false);
    setSelectedShareFriends([]);
    selectedMessageRef.current = null;
    setSelectedMessage(null);
  } catch (error) {
    console.error("Error sharing message:", error);
    alert("Something went wrong while sharing.");
  }
};

  useEffect(() => {
  const fetchFriends = async () => {
    const email = sessionStorage.getItem("email");
    if (!email) return;

    try {
      const response = await fetch(
<<<<<<< HEAD
        `https://smart-connect-backend-eu0p.onrender.com/api/user/current?email=${email}`
=======
        `http://localhost:5000/api/user/current?email=${email}`
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
      );
      const data = await response.json();

      const friendList = (data.friends || []).map((f) => ({
        name: f.name,
        email: f.email,
        profilePic: f.profilePic && f.profilePic.trim() ? f.profilePic : null,
        isOnline: f.isOnline || false,
        lastSeen: f.lastSeen || null,
      }));

      console.log("📋 Initial friends fetch:", friendList);

      // 🧮 Fetch unread counts and last message time for each friend in parallel
      const unreadMap = {};
      const lastMessageMap = {};

      const allPromises = friendList.map(async (f) => {
        try {
          // 1️⃣ Get unread count
          const unreadRes = await fetch(
<<<<<<< HEAD
            `https://smart-connect-backend-eu0p.onrender.com/api/chat/unread-count?senderEmail=${f.email}&receiverEmail=${email}`
=======
            `http://localhost:5000/api/chat/unread-count?senderEmail=${f.email}&receiverEmail=${email}`
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
          );
          const unreadData = await unreadRes.json();
          unreadMap[f.email] = unreadData.unreadCount || 0;

          // 2️⃣ Get last message timestamp
          const lastMsgRes = await fetch(
<<<<<<< HEAD
            `https://smart-connect-backend-eu0p.onrender.com/api/chat/last-message-time?user1=${email}&user2=${f.email}`
=======
            `http://localhost:5000/api/chat/last-message-time?user1=${email}&user2=${f.email}`
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
          );
          const lastMsgData = await lastMsgRes.json();
          lastMessageMap[f.email] = lastMsgData.lastMessageTime || null;
        } catch (err) {
          console.error(`Error fetching data for ${f.email}:`, err);
          unreadMap[f.email] = 0;
          lastMessageMap[f.email] = null;
        }
      });

      await Promise.all(allPromises);

      // 3️⃣ Sort friends: unread first, then latest message time
      const sortedFriends = [...friendList].sort((a, b) => {
        const unreadA = unreadMap[a.email] || 0;
        const unreadB = unreadMap[b.email] || 0;
        const timeA = lastMessageMap[a.email]
          ? new Date(lastMessageMap[a.email])
          : 0;
        const timeB = lastMessageMap[b.email]
          ? new Date(lastMessageMap[b.email])
          : 0;

        if (unreadA > unreadB) return -1;
        if (unreadA < unreadB) return 1;
        return timeB - timeA; // newer chats first
      });

      console.log("📊 Initial sorted friends:", sortedFriends);
      setFriends(sortedFriends);
      setUnreadCounts(unreadMap);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // Wait a bit to ensure socket has connected and registerSocket was sent
  const timer = setTimeout(() => {
    fetchFriends();
  }, 1000);

  return () => clearTimeout(timer);
}, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedFriend) return;
      const senderEmail = sessionStorage.getItem("email");

      try {
        // 1️⃣ Fetch the conversation
        const response = await fetch(
<<<<<<< HEAD
          `https://smart-connect-backend-eu0p.onrender.com/api/chat/conversation?senderEmail=${senderEmail}&receiverEmail=${selectedFriend}`
=======
          `http://localhost:5000/api/chat/conversation?senderEmail=${senderEmail}&receiverEmail=${selectedFriend}`
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
        );
        const data = await response.json();

        // 2️⃣ Update state with fetched messages
        setMessages((prev) => ({ ...prev, [selectedFriend]: data }));

        // 3️⃣ Mark messages as seen in the backend
        await markMessagesAsSeen();

        // Reset unread count for this friend
        setUnreadCounts((prev) => ({ ...prev, [selectedFriend]: 0 }));

        // 4️⃣ Instantly reflect "seen" in UI (optional, for smoother UX)
        setMessages((prev) => ({
          ...prev,
          [selectedFriend]: (prev[selectedFriend] || []).map((msg) =>
            msg.receiverId?.email === senderEmail
              ? { ...msg, isSeen: true }
              : msg
          ),
        }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedFriend]);

  const markMessagesAsSeen = async () => {
    if (!selectedFriend) return;

    const senderEmail = sessionStorage.getItem("email");

    try {
<<<<<<< HEAD
      await fetch("https://smart-connect-backend-eu0p.onrender.com/api/chat/mark-seen", {
=======
      await fetch("http://localhost:5000/api/chat/mark-seen", {
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: senderEmail,       // the one who’s viewing
          receiverEmail: selectedFriend,  // the one whose chat is opened
        }),
      });
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };


  const sendMessage = async () => {
  if (!newMessage.trim() && !file) return;
  const senderEmail = sessionStorage.getItem("email");

  try {
    let messageData = null;

    // 📤 If file is selected
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("senderEmail", senderEmail);
      formData.append("receiverEmail", selectedFriend);
<<<<<<< HEAD
      // include reply metadata if replying to a message
      if (replyTo) {
        formData.append("replyToId", replyTo._id || replyTo.id || "");
        formData.append("replyToText", replyTo.text || replyTo.fileName || "");
      }

      const res = await fetch("https://smart-connect-backend-eu0p.onrender.com/api/chat/send", {  // ✅ fixed here
=======

      const res = await fetch("http://localhost:5000/api/chat/send", {  // ✅ fixed here
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        messageData = data.data;  // ✅ use 'data.data' not 'data.message'
      }
      setFile(null);
    } else {
      // ✉️ Text message
<<<<<<< HEAD
      const payload = {
        senderEmail,
        receiverEmail: selectedFriend,
        text: newMessage,
      };
      if (replyTo) {
        payload.replyToId = replyTo._id || replyTo.id || "";
        payload.replyToText = replyTo.text || replyTo.fileName || "";
      }

      const response = await fetch("https://smart-connect-backend-eu0p.onrender.com/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
=======
      const response = await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail,
          receiverEmail: selectedFriend,
          text: newMessage,
        }),
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
      });

      const data = await response.json();
      if (response.ok) messageData = data.data;
      setNewMessage("");
    }

    if (messageData) {
<<<<<<< HEAD
  // Attach reply metadata locally so UI shows quoted content
  const messageWithReply = replyTo ? { ...messageData, replyTo: { _id: replyTo._id || replyTo.id, text: replyTo.text, fileName: replyTo.fileName, fileType: replyTo.fileType, fileUrl: replyTo.fileUrl, senderId: replyTo.senderId } } : messageData;

  // ✅ Show immediately for sender
  setMessages((prev) => ({
    ...prev,
    [selectedFriend]: [...(prev[selectedFriend] || []), messageWithReply],
=======
  // ✅ Show immediately for sender
  setMessages((prev) => ({
    ...prev,
    [selectedFriend]: [...(prev[selectedFriend] || []), messageData],
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
  }));

  // ✅ Emit to Socket.IO for real-time delivery
  // Add senderEmail and receiverEmail to the message data if not present
  const messageToEmit = {
<<<<<<< HEAD
    ...(messageWithReply || messageData),
=======
    ...messageData,
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
    senderEmail: messageData.senderEmail || messageData.senderId?.email || senderEmail,
    receiverEmail: messageData.receiverEmail || messageData.receiverId?.email || selectedFriend,
  };
  console.log("📤 Emitting to Socket.IO:", messageToEmit);
  socket.emit("sendMessage", messageToEmit);
<<<<<<< HEAD

  // clear reply preview after send
  setReplyTo(null);
=======
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
}

  } catch (error) {
    console.error("Error sending message:", error);
  }
};

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

return (
  <div className="chat-app">
    {/* Sidebar */}
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ←
        </button>
        <h2> Chats </h2>
      </div>

      <ul className="friends-list">
        {friends.length > 0 ? (
          friends.map((friendObj, index) => (
            <li
              key={index}
              className={`friend-item ${
                selectedFriend === friendObj.email ? "active" : ""
              }`}
              onClick={() => setSelectedFriend(friendObj.email)}
            >
              <img
                src={friendObj.profilePic || defaultImg}
                alt={friendObj.name}
                className="friend-avatar"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultImg;
                }}
              />
              <span>{friendObj.name}</span>
              {unreadCounts[friendObj.email] > 0 && (
                <span className="unread-badge">
                  {unreadCounts[friendObj.email]}
                </span>
              )}
            </li>
          ))
        ) : (
          <p className="no-friends">No friends added yet</p>
        )}
      </ul>
    </div>

    {/* Chat Area */}
    <div className="chat-area">
      {!selectedFriend ? (
        <div className="chat-welcome">
          <h2>Welcome to SmartConnect Chat</h2>
          <p>Select a friend to start conversation 💬</p>
        </div>
      ) : (
        <>
          <div className="chat-header">
            <img
              src={
                friends.find((f) => f.email === selectedFriend)?.profilePic || defaultImg
              }
              alt={friends.find((f) => f.email === selectedFriend)?.name}
              className="chat-header-avatar"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultImg;
              }}
            />

            <div className="chat-header-info">
              <h3>{friends.find((f) => f.email === selectedFriend)?.name}</h3>
              <p className="chat-status">
                {(() => {
                  const friend = friends.find((f) => f.email === selectedFriend);
                  if (!friend) return "Unknown";

                  if (friend.isOnline) return "🟢 Online";

                  if (!friend.lastSeen) return "Last seen: Unknown";

                  return `Last seen: ${formatLastSeen(friend.lastSeen)}`;
                })()}
              </p>
            </div>
          </div>


        <div className="chat-box">
          {(messages[selectedFriend] || []).map((msg, index) => {
            const me = (sessionStorage.getItem("email") || "").toLowerCase().trim();
            const senderEmail = (
              (msg.senderEmail ||
                (msg.senderId && msg.senderId.email) ||
                msg.senderId) + ""
            )
              .toLowerCase()
              .trim();

            const isSent =
              (senderEmail && me && senderEmail === me) || msg.from === "You";

            let senderLabel;
            if (isSent) senderLabel = "You";
            else if (msg.senderId?.name) senderLabel = msg.senderId.name;
            else if (msg.senderId?.email) senderLabel = msg.senderId.email;
            else if (senderEmail) {
              const friend = friends.find((f) => f.email === senderEmail);
              senderLabel = friend ? friend.name : senderEmail;
            } else {
              senderLabel =
                friends.find((f) => f.email === selectedFriend)?.name || "Unknown";
            }

            return (
              <div
                key={index}
                className={`chat-message ${isSent ? "sent" : "received"}`}
                onMouseEnter={() => setSelectedMessage(msg)}
              >
                <div className="message-content">
<<<<<<< HEAD
                  {msg.replyTo && (
                    <div className="message-quote">
                      <div className="quote-accent" />
                      <div className="quote-body">
                        <div className="quote-sender">
                          {msg.replyTo.senderId?.name || msg.replyTo.senderId?.email || msg.replyTo.senderEmail || "Unknown"}
                        </div>
                        <div className="quote-text">
                          {msg.replyTo.fileType === "image" && msg.replyTo.fileUrl ? (
                            <img
                              src={
                                (msg.replyTo.fileUrl || "").startsWith("http")
                                  ? msg.replyTo.fileUrl
                                  : `${BASE_URL}${msg.replyTo.fileUrl}`
                              }
                              alt={msg.replyTo.fileName || "image"}
                              className="quote-thumb"
                            />
                          ) : (
                            (msg.replyTo.text || msg.replyTo.fileName || "")
                          )}
                        </div>
                      </div>
                    </div>
                  )}
=======
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
                  {msg.text && (
                    <p>
                      <strong>{!isSent ? `${senderLabel}: ` : ""}</strong>
                      {msg.text}
                    </p>
                  )}

                {msg.fileType === "image" && (
                <img
                  src={
                    msg.fileUrl.startsWith("http")
                      ? msg.fileUrl
                      : `${BASE_URL}${msg.fileUrl}`
                  }
                  alt="sent"
                  className="chat-image"
                />
              )}

              {msg.fileType === "pdf" && (
                <div
                  className="chat-pdf-file"
                  onClick={() =>
                    window.open(
                      msg.fileUrl.startsWith("http")
                        ? msg.fileUrl
                        : `${BASE_URL}${msg.fileUrl}`,
                      "_blank"
                    )
                  }
                >
                  📄 {msg.fileName || msg.fileUrl.split("/").pop()}
                </div>
              )}

              {msg.fileType === "audio" && (
                <audio
                  controls
                  className="chat-audio"
                  autoPlay={isSent && index === (messages[selectedFriend]?.length || 0) - 1}
                >
                  <source
                    src={
                      msg.fileUrl.startsWith("http")
                        ? msg.fileUrl
                        : `${BASE_URL}${msg.fileUrl}`
                    }
                    type="audio/webm"
                  />
                  Your browser does not support audio playback.
                </audio>
              )}


                </div>

                <button
                  className="message-arrow"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMessage(msg);
                    setContextMenu({
                      visible: !contextMenu.visible,
                      x: e.pageX,
                      y: e.pageY,
                    });
                  }}
                  aria-label="message menu"
                >
                  <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
                </button>

                <div className="message-footer">
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {isSent && (
                    <div className="message-status">
                      {msg.isSeen ? (
                        <span className="ticks seen">✔✔</span>
                      ) : (
                        <span className="ticks delivered">✔</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>



          {/* ✅ Context Menu */}
          {contextMenu.visible && (
            <div
              className="message-menu"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: contextMenu.y,
                left: contextMenu.x,
                background: "#222",
                color: "white",
                borderRadius: "8px",
                padding: "6px 10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                zIndex: 1000,
              }}
            >
              {selectedMessage?.fileType ? (
                <>
                  <div className="menu-item" onClick={() => openShareForMessage(selectedMessage)}>📤 Share</div>
                  <div className="menu-item" onClick={() => window.open(selectedMessage.fileUrl, "_blank")}>⬇ Download</div>
                  <div className="menu-item" onClick={handleReply}>↩ Reply</div>
                  <div className="menu-item" onClick={handleDelete}>🗑 Delete</div>
                </>
              ) : (
                <>
                  <div className="menu-item" onClick={handleCopy}>📋 Copy</div>
                  <div className="menu-item" onClick={handleReply}>↩ Reply</div>
                  {/* <div className="menu-item" onClick={handleShare}>📤 Share</div> */}
                  <div className="menu-item" onClick={() => openShareForMessage(selectedMessage)}>
                    📤 Share
                  </div>

                  <div className="menu-item" onClick={handleDelete}>🗑 Delete</div>
                </>
              )}
            </div>
          )}

          {/* ✅ Share Popup */}
          {showSharePopup && (
            <div className="share-popup">
              <div className="share-popup-content">
                <h3>Share message with:</h3>
                <div className="friends-share-list">
                  {friends.map((f, i) => (
                    <label key={i} className="share-friend-item">
                      <input
                        type="checkbox"
                        checked={selectedShareFriends.includes(f.email)}
                        onChange={() => {
                          setSelectedShareFriends((prev) =>
                            prev.includes(f.email)
                              ? prev.filter((e) => e !== f.email)
                              : [...prev, f.email]
                          );
                        }}
                      />
                      <img
                        src={f.profilePic || defaultImg}
                        alt={f.name}
                        className="share-friend-avatar"
                      />
                      <span>{f.name}</span>
                    </label>
                  ))}
                </div>

                <div className="share-popup-actions">
                  <button onClick={handleConfirmShare}>Share</button>
                  <button onClick={() => setShowSharePopup(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
<<<<<<< HEAD
          <div className="chat-input">
            <div className="input-row">
              <div className="left-controls">
                <label className="upload-btn">
                  +
                  <input
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                  />
                </label>

                {/* Emoji button placed in left controls */}
                <button
                  className="emoji-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  😊
                </button>

                {showEmojiPicker && (
                  <div className="emoji-picker-popup" ref={emojiRef}>
                    <EmojiPicker
                      onEmojiClick={(emojiData) =>
                        setNewMessage((prev) => prev + emojiData.emoji)
                      }
                      emojiStyle="native"
                      theme="light"
                    />
                  </div>
                )}
              </div>

              <div className="input-center">
                {replyTo && (
                  <div className="reply-preview">
                    <div className="reply-accent" />
                    <div className="reply-content">
                      <div className="reply-header">
                        <strong>
                          {replyTo.senderId?.name || replyTo.senderId?.email || replyTo.senderEmail || "Unknown"}
                        </strong>
                      </div>
                      <div className="reply-body">
                        {replyTo.fileType === "image" && replyTo.fileUrl ? (
                          <img
                            src={
                              (replyTo.fileUrl || "").startsWith("http")
                                ? replyTo.fileUrl
                                : `${BASE_URL}${replyTo.fileUrl}`
                            }
                            alt={replyTo.fileName || "image"}
                            className="reply-thumb"
                          />
                        ) : null}

                        <div className="reply-text">
                          {replyTo.text || replyTo.fileName || (replyTo.fileType ? replyTo.fileType : "")}
                        </div>
                      </div>
                    </div>
                    <button className="reply-close" onClick={() => setReplyTo(null)} aria-label="Cancel reply">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                )}

                <input
                  type="text"
                  placeholder={file ? `Selected: ${file.name}` : "Type a message..."}
                  value={file ? "" : newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={!!file}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
              </div>

              <div className="right-controls">
                <button
                  className={`mic-btn ${recording ? "recording" : ""}`}
                  onClick={handleVoiceRecord}
                  title={recording ? "Stop Recording" : "Record Voice"}
                >
                  <i className="fa-solid fa-microphone"></i>
                </button>

                <button className="send-btn" onClick={sendMessage}>Send</button>
              </div>
            </div>
          </div>
=======



          <div className="chat-input">
          <label className="upload-btn">
            +
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
            />
          </label>

              {showEmojiPicker && (
                <div className="emoji-picker-popup" ref={emojiRef}>
                  <EmojiPicker
                    onEmojiClick={(emojiData) =>
                      setNewMessage((prev) => prev + emojiData.emoji)
                    }
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

            {/* ✅ Emoji Button */}
            <button
              className="emoji-btn"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😊
            </button>


          <input
            type="text"
            placeholder={file ? `Selected: ${file.name}` : "Type a message..."}
            value={file ? "" : newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!!file}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(); // ✅ Pressing Enter will also send the message
              }
            }}
          />

          <button
            className={`mic-btn ${recording ? "recording" : ""}`}
            onClick={handleVoiceRecord}
            title={recording ? "Stop Recording" : "Record Voice"}
          >
            <i className="fa-solid fa-microphone"></i>
          </button>

          <button onClick={sendMessage}>Send</button> {/* ✅ Send button still works */}
        </div>
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203

        </>
      )}
    </div>
  </div>
);
};

export default ChatMessaging;