import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import uploadRoutes from "./routes/uploadPdf.js";
import pdfQueryRoutes from "./routes/pdfQuery.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", chatRoutes);
app.use("/api", uploadRoutes);
app.use("/api", pdfQueryRoutes);
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uploads directory");
}

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});