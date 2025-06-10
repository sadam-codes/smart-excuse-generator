import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../models/userModel.js";

import dotenv from "dotenv";
dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//yaha se signup ka logic start ho raha hai
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(name, email, hashedPassword, role);
    const token = generateToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
};

//yaha se login ka logic start ho raha hai
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
//yaha se admin ka logic start ho raha hai

export const admin = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
  res.json({ message: `Welcome Admin (ID: ${req.user.id})` });
}

//yaha se user ka logic start ho raha hai
export const user = async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ error: "Access denied: Users only" });
  }
  res.json({ message: `Welcome User (ID: ${req.user.id})` });
}
