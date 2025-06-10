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
            currentChunks.push("Failed to retrieve data.");
            setChunks([...currentChunks]);
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
            toast.success("PDF uploaded and embedded successfully!");
            setPdf(null);
        } catch (error) {
            console.error("Upload Error:", error);
            toast.dismiss();
            toast.error("Upload failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white px-4 py-10">
            <Toaster position="top-center" reverseOrder={false} />
            <main className="max-w-2xl mx-auto space-y-2">
                <div className="bg-white text-black bg-opacity-90 backdrop-blur rounded-3xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-5">📄 Upload PDF</h2>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        className="w-full mb-4 border border-black rounded-lg p-4"
                    />
                    <button
                        onClick={uploadPdf}
                        className="w-full py-4 bg-black text-white font-semibold rounded-lg"
                    >
                        Upload PDF
                    </button>
                </div>
                <div className="bg-white text-black rounded-3xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-5">💬 Ask from PDF</h2>
                    <input
                        className="border p-3 w-full rounded-lg mb-4"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask a question from the uploaded PDF..."
                        disabled={loading}
                    />
                    <button
                        onClick={() => streamPDFAnswer(prompt)}
                        disabled={loading}
                        className="w-full py-3 rounded-lg text-white font-semibold bg-black"
                    >
                        {loading ? "Thinking..." : "Ask Me"}
                    </button>

                    {markdownText && (
                        <div className="mt-6 p-4 border rounded-lg bg-white text-black font-medium whitespace-pre-wrap">
                            <ReactMarkdown>{markdownText}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Chat;
