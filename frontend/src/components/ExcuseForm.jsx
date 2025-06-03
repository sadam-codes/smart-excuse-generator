import React, { useState } from "react";
import axios from "axios";

const ExcuseForm = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const generateExcuse = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5000/api/generate-excuse", {
        prompt,
      });
      setResponse(res.data.response || JSON.stringify(res.data, null, 2));
    } catch (error) {
      setResponse("Failed to generate excuse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col border-2 bg-black fixed top-0 w-full">
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-xl max-w-xl w-full p-10">
          <h2 className="text-4xl font-bold text-black mb-8 text-center drop-shadow-sm">
            Generate Your Excuse
          </h2>
          <input
            className="borde p-4 w-full rounded-2xl mb-6 "
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your excuse? "
            disabled={loading}
          />
          <button
            className={`w-full py-4 rounded-2xl text-white font-semibold transition ${loading
              ? "bg-black"
              : "bg-black"
              } shadow-lg`}
            onClick={generateExcuse}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Excuse"}
          </button>
          {response && (
           <div className="mt-8 p-6 border rounded-2xl whitespace-pre-line font-medium ">
              {response}
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default ExcuseForm;
