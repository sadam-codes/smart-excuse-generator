import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import uploadRoutes from "./routes/PdfUploadRoute.js";
import pdfQueryRoutes from "./routes/pdfQueryRoute.js";
import authRoutes from "./routes/authRoute.js";
import cron from "node-cron";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api", pdfQueryRoutes);
app.use("/api/auth", authRoutes);

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uploads directory");
}
//cron Job
function logMessage() {
  console.log('Cron job executed at:', new Date().toLocaleString());
}
// setInterval(logMessage,1000)

cron.schedule('* * * * *', () => {
  logMessage();
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});

// Handle 404 errors