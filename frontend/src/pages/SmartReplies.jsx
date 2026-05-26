import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import "../styles/SmartReplies.css";

const SmartReplies = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi — I\'m your personal assistant. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Fetch available models from backend proxy
  useEffect(() => {
    let mounted = true;
    const fetchModels = async () => {
      try {
        const res = await fetch("https://smart-connect-backend-eu0p.onrender.com/api/ai/models");
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;

        // data may be array of strings or objects with `name` or `id`
        const normalized = Array.isArray(data)
          ? data.map((m) => (typeof m === "string" ? m : m.name || m.id || JSON.stringify(m)))
          : [];

        setModels(normalized);
        if (normalized.length > 0) {
          // Prefer phi3:latest when available, otherwise default to first model
          const preferred = normalized.find((m) => m === "phi3:latest" || (typeof m === "string" && m.includes("phi3:latest"))) || normalized[0];
          setSelectedModel((prev) => prev || preferred);
        }
      } catch (err) {
        console.warn("Could not fetch AI models:", err);
      }
    };

    fetchModels();
    return () => {
      mounted = false;
    };
  }, []);

  const addMessage = (msg) => {
    setMessages((m) => [...m, msg]);
  };

  const getAIReply = async (prompt) => {
    try {
      const payload = { prompt };
      if (selectedModel) payload.model = selectedModel;

      const res = await fetch("https://smart-connect-backend-eu0p.onrender.com/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        console.error("AI proxy error:", errBody || res.statusText);
        let serverErrorText = errBody?.error || errBody?.message || res.statusText || "AI proxy error";
        // Normalize objects to a readable string to avoid React rendering errors
        if (typeof serverErrorText === "object") {
          serverErrorText = serverErrorText?.message || JSON.stringify(serverErrorText);
        }
        return serverErrorText;
      }

      const data = await res.json();
      if (data?.reply) return data.reply;
      return "(No reply)";
    } catch (err) {
      console.error("AI proxy call failed:", err);
      if (typeof err === "string" && err.length > 0) return err;

      const simpleReplies = [
        "Interesting — tell me more.",
        "I think you might try rephrasing that for clarity.",
        "I can help with that. What outcome do you want?",
        "Here's a short suggestion: consider breaking the task into smaller steps.",
      ];

      const lowered = (prompt || "").toLowerCase();
      if (lowered.includes("hi") || lowered.includes("hello")) return "Hello! How can I help you today?";
      if (lowered.includes("help") || lowered.includes("how do")) return "I can help. What specifically are you trying to do?";
      if (lowered.includes("bug") || lowered.includes("error")) return "Describe the error and I\'ll suggest debugging steps.";

      return simpleReplies[Math.floor(Math.random() * simpleReplies.length)];
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    addMessage({ sender: "user", text });
    setInput("");

    setLoading(true);
    addMessage({ sender: "ai", text: "..." });

    const aiReply = await getAIReply(text);

    setMessages((prev) => {
      const withoutLastPlaceholder = prev.slice(0, -1);
      return [...withoutLastPlaceholder, { sender: "ai", text: aiReply }];
    });

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <HomeNavbar />
      <div className="smart-replies-container">
        <div className="smart-replies-header">
          <button className="back-btn" onClick={() => navigate(-1)}>&larr; Back</button>
          <h2>AI Smart Replies</h2>
        </div>

        <div className="chat-window">
          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.sender}`}>
              <div className="message-text">{m.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-controls">
          {models.length > 0 && (
            <select
              className="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {models.map((m, idx) => (
                <option key={idx} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}
          <textarea
            placeholder="Type your message... (Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <div className="controls-row">
            <div className="keynote">
              <span>
                AI replies are powered by a local Ollama model via the server proxy. Make sure Ollama
                is running locally (default: `http://localhost:11434`) and the model you want is available.
                If Ollama is not running, the app will fall back to simple local replies.
              </span>
            </div>
            <button onClick={handleSend} disabled={loading} className="send-btn">
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SmartReplies;
