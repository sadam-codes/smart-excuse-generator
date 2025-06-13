
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { generateOtp, otpStore } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Signup logic
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(name, normalizedEmail, hashedPassword, role);
    const token = generateToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
};

// Login logic
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email); // however you're finding the user
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token, role: user.role });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


// Admin access
export const adminAccess = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
  res.json({ message: `Welcome Admin (ID: ${req.user.id})` });
};

// User access
export const userAccess = async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ error: "Access denied: Users only" });
  }
  res.json({ message: `Welcome User (ID: ${req.user.id})` });
};

// Get all users
export const getAllUsers = async (req, res) => {
  const result = await pool.query("SELECT name, email, role FROM users");
  res.json(result.rows);
};

// OTP: send
export const sendOtp = async (req, res) => {
  console.log("Request received for /send-otp");
  console.log("Raw Request Body:", req.body);

  const { email } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) {
    console.log("Missing email in request body");
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const otp = generateOtp().toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(normalizedEmail, { otp, expiresAt });
    console.log(`OTP stored for ${normalizedEmail}:`, otp);

    await sendOtpEmail(normalizedEmail, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// OTP: verify and auth
export const verifyAndAuth = async (req, res) => {
  const { email, otp, name, password, role, isSignup } = req.body;
  const normalizedEmail = email.toLowerCase();

  console.log("Request Body:", req.body);
  console.log("Stored OTP:", otpStore.get(normalizedEmail));

  const stored = otpStore.get(normalizedEmail);

  if (!stored || stored.otp !== otp.toString() || Date.now() > stored.expiresAt) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  let user;
  if (isSignup) {
    const hashed = await bcrypt.hash(password, 10);
    user = await createUser(name, normalizedEmail, hashed, role);
  } else {
    user = await findUserByEmail(normalizedEmail);
    if (!user) return res.status(400).json({ message: "User not found" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  otpStore.delete(normalizedEmail); // clean up

  res.json({ token, role: user.role });

};
