import { ChatOpenAI } from "@langchain/openai";
import { getVectorStore } from "../utils/vectorStore.js";

export class ChatController {
  static async chat(req, res) {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const vectorStore = await getVectorStore();
      const similarDocs = await vectorStore.similaritySearch(message, 3);
      const context = similarDocs.map(doc => doc.pageContent).join("\n---\n");

      const model = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0,
      });

      const response = await model.invoke([
        {
          role: "system",
          content: `Use the context below to answer the question. End each response with 'My name is Khan'.`,
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion:\n${message}`,
        },
      ]);

      res.status(200).json({ reply: response.content });
    } catch (error) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
