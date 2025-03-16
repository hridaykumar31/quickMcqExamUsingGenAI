const mongoose = require("mongoose");

const MCQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  createdAt: { type: Date, default: Date.now },
  examId: { type: String, required: true },  
  userEmail: { type: String, required: true }
});

module.exports = mongoose.model("MCQ", MCQSchema);
