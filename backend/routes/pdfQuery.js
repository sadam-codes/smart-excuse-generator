import express from "express";
import { PdfQueryController } from "../controllers/pdfQueryController.js";

const router = express.Router();

router.post("/pdf-retrieving", PdfQueryController);

export default router;
