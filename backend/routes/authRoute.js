
import express from "express";
import { signup, login , adminAccess, userAccess } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/admin", authenticate, adminAccess);
router.get("/user", authenticate, userAccess);

export default router;
