import React, { useState } from "react";
import axios from "axios";
import MCQList from "./MCQList"; 

const CreateExam = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5000/api/generate", {
        prompt: prompt,
      });
      console.log("API Response:", res.data); 
      setResponse(res.data.response);
    } catch (err) {
      setError("Failed to generate content.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Generate MCQs
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block font-semibold text-gray-700">
              Enter Prompt:
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="5"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Generate 10 multiple-choice questions about DS algorithms, following this format: Start each question with **Question <number>: **. Provide 4 options, each starting with (A), (B), (C), or (D). Indicate the correct answer with **Correct Answer:** (letter). Provide a short explanation with **Explanation:**.skip this type of line 1. Here are 10 multiple-choice questions about  only mcq without extra text"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Generating..." : "Generate MCQs"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
        
        {response && (
          <div>
            <p className="mt-4 text-gray-700">Generated MCQs:</p>
            <MCQList response={response} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateExam;

