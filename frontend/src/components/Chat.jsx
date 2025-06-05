import React, { useState } from "react";
import axios from "axios";

const Chat = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [pdf, setPdf] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const askQuestionFromPDF = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setResponse("");

        try {
            const res = await axios.post("http://localhost:4000/api/pdf-query", {
                question: prompt,
            });
            setResponse(res.data.answer || "No response found.");
        } catch (error) {
            setResponse("❌ Failed to get response from server.");
            console.error("PDF Query Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdf(file);
            setUploadStatus("");
        } else {
            setUploadStatus("❌ Only PDF files are allowed.");
        }
    };

    const uploadPdf = async () => {
        if (!pdf) {
            setUploadStatus("❌ Please select a PDF file.");
            return;
        }

        setUploadStatus("⏳ Uploading...");
        const formData = new FormData();
        formData.append("pdf", pdf);

        try {
            await axios.post("http://localhost:4000/api/upload", formData);
            setUploadStatus("✅ PDF uploaded and embedded successfully!");
            setPdf(null);
        } catch (error) {
            console.error("Upload Error:", error);
            setUploadStatus("❌ Upload failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white px-4 py-10">
            <main className="max-w-2xl mx-auto space-y-12">
                {/* Upload PDF Section */}
                <div className="bg-white text-black bg-opacity-90 backdrop-blur rounded-3xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-4">📄 Upload PDF</h2>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        className="w-full mb-4 border border-gray-300 rounded-lg p-3"
                    />
                    <button
                        onClick={uploadPdf}
                        className="w-full py-3 bg-black text-white font-semibold rounded-lg"
                    >
                        Upload PDF
                    </button>
                    {uploadStatus && (
                        <div className="mt-4 text-sm text-center font-medium text-gray-800">{uploadStatus}</div>
                    )}
                </div>
                <div className="bg-white text-black bg-opacity-90 backdrop-blur rounded-3xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-4">💬 Ask from PDF</h2>
                    <input
                        className="border p-3 w-full rounded-lg mb-4"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask a question from the uploaded PDF..."
                        disabled={loading}
                    />
                    <button
                        onClick={askQuestionFromPDF}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-semibold transition ${loading ? "bg-gray-600" : "bg-black"
                            }`}
                    >
                        {loading ? "Thinking..." : "Ask"}
                    </button>
                    {response && (
                        <div className="mt-6 p-4 border rounded-lg whitespace-pre-line bg-gray-100 text-black font-medium">
                            {response}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
export default Chat;
