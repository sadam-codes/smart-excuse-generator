import { ChatOpenAI } from "@langchain/openai";
import { getVectorStore } from "../utils/vectorStore.js";

export const PdfQueryController = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const vectorStore = await getVectorStore();
    const docs = await vectorStore.similaritySearch(question, 3);
    const context = docs.map(doc => doc.pageContent).join("\n---\n");

    const chatModel = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0,
      streaming: true,
    });

    const stream = await chatModel.stream([
      {
        role: "system",
        content: `Use the context below to answer the question. Respond naturally.\n\nContext:\n${context}`,
      },
      {
        role: "user",
        content: question,
      },
    ]);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let buffer = "";
    for await (const chunk of stream) {
      if (chunk.content) {
        buffer += chunk.content;
        if (/[.!?]\s*$/.test(buffer) || buffer.length > 100) {
          res.write(`data: ${buffer.trim()}\n`);
          buffer = "";
        }
      }
    }
    if (buffer.length > 0) {
      res.write(`data: ${buffer.trim()}\n`);
    }
    res.end();
  } catch (error) {
    console.error("Streaming Error:", error);
    res.status(500).json({ error: "Failed to stream answer." });
  }
};
