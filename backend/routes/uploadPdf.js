import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadAndProcessPDF } from "../controllers/uploadPdfController.js";

const router = express.Router();

// Use the correct field name from the form (in Postman it's 'pdf')
router.post("/upload", upload.single("pdf"), uploadAndProcessPDF);

export default router;
