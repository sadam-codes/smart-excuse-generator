import express from "express";
import { PdfQueryController } from "../controllers/pdfQueryController.js";

const router = express.Router();

router.post("/pdf-query", PdfQueryController.queryFromPdf);

export default router;
