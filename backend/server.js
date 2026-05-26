import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import membersRoute from "./routes/members.js";
import userRoute from "./routes/user.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiOllamaRoute from "./routes/ai_ollama.js";
import User from "./models/User.js";
// import aiSuggestionRoute from "./routes/aiSuggestion.js";
import groupRoute from "./routes/groupRoutes.js";

// ✅ ES module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
dotenv.config({ path: "./config.env" });

// ✅ Initialize Express app FIRST
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Create HTTP server for Socket.IO
const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // ✅ your frontend port
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });


const io = new Server(server, {
  cors: {
    origin: "https://smart-connect-gules.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userConnections = {}; // store all active sockets per user
const userSocketMap = {}; // map socket ID to email for quick lookup

app.set('io', io);
app.set('userConnections', userConnections);

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // 🔹 Register user when frontend connects
  socket.on("registerSocket", async (email) => {
    if (!email) return;

    if (!userConnections[email]) userConnections[email] = new Set();
    userConnections[email].add(socket.id);
    userSocketMap[socket.id] = email; // Track socket to email mapping

    const user = await User.findOneAndUpdate(
      { email },
      { socketId: socket.id, isOnline: true, lastSeen: null },
      { new: true }
    );

    console.log(`🟢 ${email} connected (${userConnections[email].size} tabs)`);
    console.log(`   📊 DB updated: isOnline=${user.isOnline}, lastSeen=${user.lastSeen}`);

    io.emit("updateUserStatus", {
      email: user.email,
      isOnline: true,
      lastSeen: null,
    });
  });

  // 🔹 Handle new message from sender
  socket.on("sendMessage", async (messageData) => {
    console.log("📨 Message received from socket:", messageData);
    
    // Broadcast to receiver's socket(s) in real-time
    const receiverEmail = messageData.receiverEmail;
    if (userConnections[receiverEmail]) {
      userConnections[receiverEmail].forEach((socketId) => {
        io.to(socketId).emit("receiveMessage", messageData);
        console.log(`   ✅ Sent to ${receiverEmail} on socket ${socketId}`);
      });
    } else {
      console.log(`   ⚠️ ${receiverEmail} is not connected`);
    }
  });

  // 🔹 Manual logout (user clicked Logout)
  socket.on("userOffline", async (email) => {
    if (!email) return;

    const lastSeen = new Date();
    const user = await User.findOneAndUpdate(
      { email },
      { isOnline: false, lastSeen, socketId: null },
      { new: true }
    );

    if (user) {
      console.log(`🔴 ${user.email} manually logged out at ${lastSeen}`);
      console.log(`   📊 DB updated: isOnline=${user.isOnline}, lastSeen=${user.lastSeen}`);
      io.emit("updateUserStatus", {
        email: user.email,
        isOnline: false,
        lastSeen,
      });
    }
  });

  // 🔹 On tab close or disconnect
  socket.on("disconnect", async () => {
    const email = userSocketMap[socket.id];
    delete userSocketMap[socket.id];
    
    if (!email) return;

    if (userConnections[email]) {
      userConnections[email].delete(socket.id);

      // ✅ Only set offline when all tabs are closed
      if (userConnections[email].size === 0) {
        const lastSeen = new Date();

        await User.findOneAndUpdate(
          { email },
          { isOnline: false, lastSeen, socketId: null },
          { new: true }
        );

        console.log(`🔴 ${email} went offline at ${lastSeen}`);
        console.log(`   📊 DB updated: isOnline=false, lastSeen=${lastSeen}`);
        io.emit("updateUserStatus", {
          email,
          isOnline: false,
          lastSeen,
        });
      }
    }
  });
});


// ✅ Middleware
app.use(
  cors({
    origin: "https://smart-connect-gules.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/members", membersRoute);
app.use("/api/user", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiOllamaRoute);
// app.use("/api/ai-suggestion", aiSuggestionRoute);
app.use("/api/groups", groupRoute);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ✅ Start server (use `server.listen`, not `app.listen`)
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
