
import { getVectorStore } from "../utils/vectorStore.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "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" });

// Clean response formatting
function cleanText(text) {
  return text
    .replace(/\s{2,}/g, " ")
    .replace(/([a-z]) ([A-Z])/g, "$1 $2")
    .replace(/(\d) (\d)/g, "$1$2")
    .replace(/ \./g, ".")
    .replace(/ \,/g, ",")
    .replace(/\*+/g, "")
    .replace(/\s+([.,!?])/g, "$1")
    .trim();
}

export const PdfQueryController = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const vectorStore = await getVectorStore();
    const docs = await vectorStore.similaritySearch(question, 3);
    const context = docs.map(doc => doc.pageContent).join("\n---\n");

    const stream = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `Use the context below to answer the question. Respond naturally in readable sentences with markdown.\n\nContext:\n${context}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
      stream: true,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      const word = chunk.choices?.[0]?.delta?.content;
      if (word) {
        const cleaned = cleanText(word);
        res.write(`data: ${cleaned}\n\n`);
      }
    }

    res.end();
  } catch (error) {
    console.error("Groq Streaming Error:", error);
    res.status(500).json({ error: "Failed to stream answer." });
  }
};
