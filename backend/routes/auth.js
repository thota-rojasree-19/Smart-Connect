<<<<<<< HEAD

=======
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Check all fields
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

<<<<<<< HEAD
    // 🔍 Validation: Name (only alphabets)
    if (!/^[A-Za-z\s]+$/.test(name)) {
      return res.status(400).json({ message: "Name should contain only characters" });
    }

    // 🔍 Validation: Phone (exact 10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    // 🔍 Validation: Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // 🔍 Validation: Password (upper, lower, number, special)
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number, and special character",
      });
    }

=======
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

<<<<<<< HEAD
    // Ensure phone number isn't already used
=======
    // Also ensure phone number isn't already used (schema has unique constraint)
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
<<<<<<< HEAD

    // Handle duplicate key
    if (err && (err.code === 11000 || err.name === "MongoServerError")) {
      return res
        .status(400)
        .json({ message: "User with provided email or phone already exists" });
    }

=======
    // Handle duplicate key (race or missed check)
    if (err && (err.code === 11000 || err.name === "MongoServerError")) {
      return res.status(400).json({ message: "User with provided email or phone already exists" });
    }
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
    res.status(500).json({ message: "Server error" });
  }
});

<<<<<<< HEAD
// ✅ Login route
=======
// ✅ Login route (already existing)
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

<<<<<<< HEAD
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
=======
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203

    res.json({
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
<<<<<<< HEAD

=======
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
