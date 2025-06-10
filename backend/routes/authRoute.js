import express from "express";
import { signup, login , admin, user } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/admin", authenticate, admin);
router.get("/user", authenticate, user);

export default router;
