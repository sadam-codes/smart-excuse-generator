import React, { useState } from "react";
import axios from "axios";

const Chat = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [pdf, setPdf] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const generateExcuse = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setResponse("");

        try {
            const res = await axios.post("http://localhost:4000/api/search", {
                prompt,
            });
            setResponse(res.data.response || JSON.stringify(res.data, null, 2));
        } catch (error) {
            setResponse("Failed to get response.");
        } finally {
            setLoading(false);
        }
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdf(file);
        } else {
            setUploadStatus("Only PDF files are allowed.");
        }
    };

    const uploadPdf = async () => {
        if (!pdf) {
            setUploadStatus("Please select a PDF file.");
            return;
        }

        setUploadStatus("Uploading...");
        const formData = new FormData();
        formData.append("pdf", pdf);

        try {
            await axios.post("http://localhost:4000/api/upload", formData);
            setUploadStatus("PDF uploaded and embedded successfully!");
            setPdf(null);
        } catch (error) {
            console.error(error);
            setUploadStatus("Upload failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col border-2 bg-black fixed top-0 w-full">
            <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-10 py-10">
                <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-xl max-w-xl w-full p-8">
                    <h2 className="text-2xl font-bold text-black mb-4 text-center">Upload PDF</h2>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        className="w-full mb-4 border rounded-xl p-3"
                    />
                    <button
                        onClick={uploadPdf}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                    >
                        Upload PDF
                    </button>
                    {uploadStatus && (
                        <div className="mt-4 text-sm text-center font-medium">{uploadStatus}</div>
                    )}
                </div>

                {/* Chat Prompt Section */}
                {/* <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-xl max-w-xl w-full p-10">
          <h2 className="text-4xl font-bold text-black mb-8 text-center drop-shadow-sm">
            Ask Your PDF
          </h2>
          <input
            className="border p-4 w-full rounded-2xl mb-6"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a question from the uploaded PDF..."
            disabled={loading}
          />
          <button
            className={`w-full py-4 rounded-2xl text-white font-semibold transition ${
              loading ? "bg-gray-800" : "bg-black"
            } shadow-lg`}
            onClick={generateExcuse}
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
          {response && (
            <div className="mt-8 p-6 border rounded-2xl whitespace-pre-line font-medium">
              {response}
            </div>
          )}
        </div> */}
            </main>
        </div>
    );
};
export default Chat;
