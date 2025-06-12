
import express from "express";
import { signup, login, adminAccess, userAccess } from "../controllers/authController.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { sendOtp, verifyAndAuth } from "../controllers/authController.js";



const router = express.Router();

router.get("/users", authenticate, isAdmin, getAllUsers);
router.post("/signup", signup);
router.post("/login", login);
router.get("/admin", authenticate, adminAccess);
router.get("/user", authenticate, userAccess);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyAndAuth);

export default router;
