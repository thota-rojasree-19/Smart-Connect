# 💬 Smart Connect — Full-Stack Real-Time Chat Application

A **powerful full-stack real-time chat application** built with the **MERN stack (MongoDB, Express, React, Node.js)** and **Socket.IO** for instant messaging.  
This app supports **text, voice, and file-based communication**, real-time **presence indicators**, and a smooth modern UI — delivering an experience similar to leading chat platforms 🔥✨

---

## 🧠 Project Overview

**Smart Connect** is designed for seamless one-to-one communication with advanced chat features, presence tracking, emoji support, and voice message recording.  
It’s a complete end-to-end messaging system with a **React (Vite)** frontend and **Node/Express** backend integrated via **Socket.IO** for live updates.

> 💡 All AI/suggestion-related modules were removed to ensure lightweight performance and transparency.

---

## 🚀 Key Features

| Category | Features |
|-----------|-----------|
| 💬 **Messaging** | Real-time chat via Socket.IO — send, receive, and sync instantly |
| 🧑‍🤝‍🧑 **Friends System** | Online/offline status, last-seen tracking, unread count |
| 📩 **Conversations** | Last message sorting, unread highlights, auto-scroll |
| 🧾 **Message Actions** | Copy, reply, and delete messages from context menu |
| 🎙️ **Voice Chat** | Record and send voice messages using MediaRecorder API |
| 📎 **File Sharing** | Upload images, audio, and PDFs via FormData |
| 😄 **Emojis** | Emoji picker for expressive chatting |
| 👀 **Read Receipts** | Delivered and seen ticks for every message |
| 📤 **Message Sharing** | Share messages with multiple friends easily |
| ⚡ **Presence Indicators** | Real-time online/offline/typing status |
| 🧩 **Message Management** | Smart UI for clean organization and updates |
| 💾 **Robust API Calls** | Optimized fetch-based communication with backend |
| 🪟 **Cross-Platform Safe** | `.gitattributes` ensures LF/CRLF consistency on Windows/Linux |
| 🔐 **Environment Safety** | Uses `.env` to keep secrets private (not committed to repo) |

---

## 🧩 Architecture & Tech Stack

### 🖥️ Frontend
- **Framework:** React (Vite)
- **UI Libraries:** emoji-picker-react, FontAwesome
- **Storage:** sessionStorage for current user info
- **Media APIs:** MediaRecorder & getUserMedia (audio input)
- **State Handling:** Component state + socket event-based updates
- **Key File:** `frontend/src/pages/ChatMessaging.jsx`

### ⚙️ Backend
- **Server:** Node.js + Express.js
- **Realtime:** Socket.IO for messaging & presence
- **Database:** MongoDB (via Mongoose or similar)
- **File Handling:** multer (multipart/form-data)
- **Routes Observed:**
  - `/api/user/*` → User management
  - `/api/chat/*` → Chat CRUD operations
  - `/api/chat/share` → Share message API
  - `/api/chat/mark-seen` → Mark message as seen
- **Security:** JWT authentication or session-based
- **Uploads:** Stored locally or via `UPLOAD_DIR` env variable

---

## 🗂️ Repository Structure
```
SmartConnect/
│
├──frontend/ # React (Vite) frontend
│ ├── src/pages/ChatMessaging.jsx # Main chat UI
│ ├── src/components/ # Reusable React components
│ ├── assets/ # Icons, styles, media
│ ├── package.json
│ └── vite.config.js
│
├── backend/ # Express + Node backend
│ ├── server.js / index.js # Main entry point
│ ├── routes/ # User/chat route files
│ ├── controllers/ # Core logic for routes
│ ├── models/ # MongoDB schema models
│ ├── uploads/ # Media uploads folder (ignored by .gitignore)
│ ├── package.json
│ └── .env (local only)
│
├── .gitignore # Ignore node_modules, .env, uploads
├── .gitattributes # LF/CRLF normalization
└── README.md # Project documentation
```
---

## ⚙️ Environment Variables Setup

Create a `.env` file inside the **backend** folder (do NOT commit it).  
Below is an example configuration:

```bash
BACKEND_PORT=5000
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your_jwt_secret_key
UPLOAD_DIR=uploads
