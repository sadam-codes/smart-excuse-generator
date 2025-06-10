import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadAndProcessPDF } from "../controllers/uploadPdfController.js";

const router = express.Router();
router.post("/upload", upload.single("pdf"), uploadAndProcessPDF);
export default router;
