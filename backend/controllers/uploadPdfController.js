
// controllers/uploadPdfController.js
import fs from "fs";
import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { saveDocuments } from "../utils/vectorStore.js";

export const uploadAndProcessPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const filePath = path.join(process.cwd(), "uploads", req.file.filename);
    console.log("Uploaded file path:", filePath);

    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    console.log("Total chunks generated:", splitDocs.length);

    await saveDocuments(splitDocs);
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "PDF processed and embedded successfully",
      chunks: splitDocs.length,
    });
  } catch (err) {
    console.error("PDF Upload Error:", err);
    res.status(500).json({ error: "Failed to process PDF" });
  }
};

