import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import toast, { Toaster } from "react-hot-toast";

const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [markdownText, setMarkdownText] = useState("");

  const streamPDFAnswer = async (question) => {
    if (!question.trim()) return;

    setMarkdownText("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/pdf-retrieving", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("data:").filter(Boolean);

        for (let line of lines) {
          const cleaned = line.trim();
          if (cleaned) {
            buffer += cleaned.endsWith(" ") ? cleaned : cleaned + " ";
            setMarkdownText(buffer);
          }
        }
      }
    } catch (error) {
      setMarkdownText("❌ Failed to retrieve data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdf(file);
      toast.dismiss();
    } else {
      toast.error("Only PDF files are allowed.");
    }
  };

  const uploadPdf = async () => {
    if (!pdf) {
      toast.error("Please select a PDF file first.");
      return;
    }

    toast.loading("📤 Uploading...");
    const formData = new FormData();
    formData.append("pdf", pdf);

    try {
      await axios.post("http://localhost:4000/api/upload", formData);
      toast.dismiss();
      toast.success("✅ PDF uploaded successfully!");
      setPdf(null);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.dismiss();
      toast.error("Upload failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center px-4 py-10">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-4xl space-y-10">
        <div className="bg-white text-black rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
          <h2 className="text-3xl font-bold text-center">📄 Upload a PDF</h2>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={uploadPdf}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Upload PDF
          </button>
        </div>

        <div className="bg-white text-black rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
          <h2 className="text-3xl font-bold text-center">💬 Ask Questions</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your question here..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={() => streamPDFAnswer(prompt)}
              disabled={loading}
              className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-200"
            >
              {loading ? "⏳ Thinking..." : "Ask Me"}
            </button>
          </div>

          {markdownText && (
            <div className="bg-gray-50 p-4 mt-6 rounded-lg border text-gray-800 whitespace-pre-wrap">
              <ReactMarkdown>{markdownText}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
