import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import socket from "../socket.js";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

<<<<<<< HEAD
    // 🔍 Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email address");
      return;
    }

    // 🔍 Password validation (same as Signup)
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!strongPassword.test(password)) {
      setError(
        "Password must contain uppercase, lowercase, number, and special character"
      );
      return;
    }

=======
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
    setError("");
    setLoading(true);

    try {
<<<<<<< HEAD
      const res = await fetch("https://smart-connect-backend-eu0p.onrender.com/api/auth/login", {
=======
      const res = await fetch("http://localhost:5000/api/auth/login", {
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

<<<<<<< HEAD
      // Save JWT & user info
=======
      // ✅ Save JWT, user info, and fields Dashboard needs
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("email", data.user.email);
      sessionStorage.setItem("name", data.user.name);

<<<<<<< HEAD
      // Socket connection
      try {
        if (socket) {
          try {
            socket.connect();
          } catch (err) {}
=======
      // Ensure socket is connected and inform server that this user is online
      try {
        if (socket) {
          // If socket was previously disconnected (e.g., on logout), reconnect it
          try { socket.connect(); } catch (err) { /* ignore if already connected */ }
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203

          if (socket.connected) {
            socket.emit("registerSocket", data.user.email);
          } else {
<<<<<<< HEAD
            const onConnect = () => {
              try {
                socket.emit("registerSocket", data.user.email);
              } catch (e) {}
=======
            // emit once connected
            const onConnect = () => {
              try { socket.emit("registerSocket", data.user.email); } catch (e) {}
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
              socket.off("connect", onConnect);
            };
            socket.on("connect", onConnect);
          }
        }
      } catch (e) {
        console.warn("Socket error during login register:", e);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        {error && <p className="error">{error}</p>}

        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="signup-link">
        Don’t have an account? <Link to="/signup">Signup here</Link>
      </p>
    </div>
  );
};

export default Login;
<<<<<<< HEAD
=======

>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
