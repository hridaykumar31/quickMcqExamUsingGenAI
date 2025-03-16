import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const JudgeYourself = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [examDescription, setExamDescription] = useState(""); // State for exam description
  const [examTime, setExamTime] = useState(""); // State for exam time (in minutes)

  const mcqList = location.state?.mcqList || [];
  const userEmail = user?.email || "unknown@example.com"; 

  const saveMCQListToDatabase = async () => {
    const examId = `EXAM-${Math.floor(Math.random() * 100000)}`;

    if (!examDescription.trim()) {
      alert("Please enter an exam description.");
      return;
    }

    if (!examTime.trim()) {
      alert("Please enter an exam time.");
      return;
    }

    const examData = { mcqs: mcqList, userEmail, examId, examDescription, examTime };

    try {
      const response = await fetch("http://localhost:5000/mcqs/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examData),
      });

      const data = await response.json();
      console.log(data.message);
      navigate("/exam/start", { state: { examId, examDescription, examTime, userEmail } });
    } catch (error) {
      console.error("Error saving MCQs:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Judge Yourself</h2>

        <label className="block text-sm font-medium text-gray-700">
          Exam Description:
        </label>
        <input
          type="text"
          value={examDescription}
          onChange={(e) => setExamDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter exam description"
        />

        <label className="block text-sm font-medium text-gray-700">
          Exam Time (in minutes):
        </label>
        <input
          type="number"
          value={examTime}
          onChange={(e) => setExamTime(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter exam time in minutes"
          min="1"
        />

        <button
          onClick={saveMCQListToDatabase}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition w-full"
        >
          Start Exam
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 bg-gray-800 text-white text-center">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default JudgeYourself;

