import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Exam = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { examId, examDescription, examTime } = state || {}; // examTime in minutes

  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null); // Initially null to hide before submit
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(examTime * 60); // Convert minutes to seconds
  const [submitted, setSubmitted] = useState(false); // Track if exam is submitted

  const timerRef = useRef(null); // Ref to store the timer ID

  useEffect(() => {
    const fetchExamData = async () => {
      if (!examId) {
        setError("Exam ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/mcqs/${examId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch exam data");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // Auto-submit when timer reaches 0
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0)); // Prevent negative time
    }, 1000);

    return () => clearInterval(timerRef.current); // Clean up timer on component unmount
  }, [timeLeft]);

  // Convert seconds into HH:MM:SS format
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Function to extract letter inside parentheses (e.g., (C) -> C)
  const extractLetter = (option) => {
    if (!option || typeof option !== "string") return null; // Check if option is a valid string

    const match = option.match(/\(([A-Da-d])\)/); // Match single letter inside ()
    return match ? match[1].toUpperCase() : null;
  };

  const handleOptionSelect = (questionIndex, option) => {
    const selectedLetter = extractLetter(option);

    if (selectedLetter) {
      setSelectedAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionIndex]: selectedLetter, // Store only the letter
      }));
    }
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current); // Stop the timer when the exam is submitted

    let tempScore = 0;
    questions.forEach((mcq, index) => {
      const correctLetter = extractLetter(mcq.correctAnswer);
      if (selectedAnswers[index] === correctLetter) {
        tempScore += 1;
      }
    });
    setScore(tempScore);
    setSubmitted(true); // Show score on the same page
  };

  if (loading) return <p>Loading exam...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4 uppercase">{examDescription}</h2>
        
        {/* Digital Timer */}
        <p className="text-center text-xl font-semibold mb-4 bg-gray-200 p-2 rounded-md">
          ⏳ Time Left: <span className="text-red-600">{formatTime(timeLeft)}</span>
        </p>

        {Array.isArray(questions) && questions.length > 0 ? (
          questions.map((mcq, index) => (
            <div key={mcq._id || index} className="mb-4 border-b pb-4">
              <p className="font-semibold">
                <span className="text-blue-600">Q{index + 1}:</span> {mcq.question}
              </p>
              <div className="mt-2">
                {Array.isArray(mcq.options) &&
                  mcq.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`question-${index}-option-${optIndex}`}
                        name={`question-${index}`}
                        value={option}
                        checked={selectedAnswers[index] === extractLetter(option)}
                        onChange={() => handleOptionSelect(index, option)}
                        className="mr-2"
                      />
                      <label htmlFor={`question-${index}-option-${optIndex}`} className="cursor-pointer">
                        {option}
                      </label>
                    </div>
                  ))}
              </div>

              {/* Show wrong answers in red and the correct answer */}
              {submitted && selectedAnswers[index] !== extractLetter(mcq.correctAnswer) && (
                <p className="text-red-600 mt-2">❌ Incorrect</p>
              )}
              {submitted && selectedAnswers[index] === extractLetter(mcq.correctAnswer) && (
                <p className="text-green-600 mt-2">✅ Correct</p>
              )}
              {submitted && mcq.explanation && (
                <p className="text-gray-700 mt-2 italic">Explanation: {mcq.explanation}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-red-500">No questions available</p>
        )}

        {/* Show score if submitted */}
        {submitted ? (
          <div className="mt-6 p-4 bg-green-100 border border-green-500 rounded-md text-center">
            <h3 className="text-xl font-bold text-green-700">✅ Exam Submitted!</h3>
            <p className="text-lg">Your Score: <span className="font-semibold">{score}/{questions.length}</span></p>
          </div>
        ) : (
          <button
            className="w-full mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSubmit}
          >
            Submit Exam
          </button>
        )}
      </div>
    </div>
  );
};

export default Exam;
