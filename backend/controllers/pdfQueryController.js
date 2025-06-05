import { ChatOpenAI } from "@langchain/openai";
import { getVectorStore } from "../utils/vectorStore.js";

export class PdfQueryController {
  static async queryFromPdf(req, res) {
    try {
      const { question } = req.body;

      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }

      const vectorStore = await getVectorStore();
      if (!vectorStore) throw new Error("Vector store not loaded");

      const docs = await vectorStore.similaritySearch(question, 4);

      const context = docs.map(doc => doc.pageContent).join("\n---\n");
      const model = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0,
      });

      const response = await model.invoke([
        {
          role: "system",
          content: `You are a PDF assistant. Use only the context provided to answer the question.`,
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion:\n${question}`,
        },
      ]);
      res.status(200).json({
        answer: response.content,
        rawChunks: docs.map((doc, i) => ({ id: i + 1, content: doc.pageContent })),
      });
    } catch (error) {
      console.error("🔥 PDF Query Error:", error.message);
      res.status(500).json({ error: "Server error while processing question." });
    }
  }
}
