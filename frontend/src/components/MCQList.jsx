import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Function to save entire list of MCQs
const saveMCQListToDatabase = async (mcqs) => {
  try {
    const response = await fetch("http://localhost:5000/mcqs/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mcqs }), // Send all MCQs as an array
    });

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error saving MCQs:", error);
  }
};

const MCQList = ({ response }) => {
  const navigate = useNavigate(); // Use navigate inside the component
  const [isVisible, setIsVisible] = useState(true);
  const [visibleAnswers, setVisibleAnswers] = useState([]);

  if (!response) return null;

  // Split the response into individual MCQ question blocks
  const questionBlocks = response
    .split(/\*\*Question \d+\:\*/)
    .filter((q) => q.trim() !== "");

  // Prepare an array of all MCQs
  const mcqList = questionBlocks.map((block) => {
    const lines = block.trim().split("\n").map((line) => line.trim());
    const question = lines[0];
    const options = lines.slice(1).filter((line) => line.match(/^\([A-D]\)/));
    const answerLine = lines.find((line) => line.startsWith("**Correct Answer:"));
    const explanationLine = lines.find((line) => line.startsWith("**Explanation:"));

    const correctAnswer = answerLine?.replace("**Correct Answer:**", "").trim();
    const explanation = explanationLine?.replace("**Explanation:**", "").trim();

    return { question, options, correctAnswer, explanation };
  });

  // Function to toggle visibility of an answer
  const toggleAnswer = (index) => {
    setVisibleAnswers((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  // Function to navigate and pass mcqList to another component
  const handleNavigate = () => {
    navigate("/judge-yourself", { state: { mcqList } });
  };

  return (
    <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
      {/* Toggle Button for MCQ List Visibility */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        {isVisible ? "Hide" : "Show"} MCQ List
      </button>

      {/* Conditionally render MCQ List */}
      {isVisible && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Generated MCQ List:</h3>
          {mcqList.map((mcq, index) => (
            <div key={index} className="mb-4 p-3 border-b border-gray-200">
              <p className="font-medium text-gray-800">{index + 1}. {mcq.question}</p>
              {mcq.options.map((option, idx) => (
                <p key={idx} className="text-gray-700">{option}</p>
              ))}

              {/* Toggle Button for Answer Visibility */}
              <button
                onClick={() => toggleAnswer(index)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {visibleAnswers[index] ? "Hide Answer" : "Show Answer"}
              </button>

              {/* Show Answer & Explanation */}
              {visibleAnswers[index] && (
                <div className="mt-2 p-2 bg-gray-100 rounded">
                  {mcq.correctAnswer && (
                    <p className="text-green-600 font-semibold">
                      Correct Answer: {mcq.correctAnswer}
                    </p>
                  )}
                  {mcq.explanation && (
                    <p className="text-gray-600 text-sm">
                      Explanation: {mcq.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Button to navigate and pass mcqList */}
          <button
            onClick={handleNavigate}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Judge Yourself
          </button>
        </div>
      )}
    </div>
  );
};

export default MCQList;

