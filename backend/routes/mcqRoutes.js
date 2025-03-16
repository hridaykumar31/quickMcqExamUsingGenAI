const express = require("express");
const router = express.Router();
const MCQ = require("../models/MCQ");
const path = require('path');  

router.post("/add", async (req, res) => {
  try {

      const { mcqs, examId, userEmail } = req.body;

      if (!Array.isArray(mcqs)) {
          return res.status(400).json({ error: "Expected an array of MCQs" });
      }

      // Ensure all MCQs include required fields
      const formattedMCQs = mcqs.map(mcq => ({
          ...mcq,
          examId,
          userEmail
      }));

      await MCQ.insertMany(formattedMCQs);
      res.status(201).json({ message: "MCQs added successfully!" });
  } catch (error) {
      console.error("Error inserting MCQs:", error);
      res.status(500).json({ error: error.message });
  }
});

router.get("/:examId", async (req, res) => {
  try {
    const { examId } = req.params;
    console.log(req.params);
    console.log(`ExamId: ${examId}`);
    console.log(typeof examId, examId);

    // Trim the examId to avoid any leading or trailing spaces
    const stringExamId = examId.trim();

    // Find the MCQs by examId
    const mcqs = await MCQ.find({ examId: stringExamId });
   
    if (!mcqs.length) {
      return res.status(404).json({ error: "No MCQs found for this exam." });
    }

    // Send the fetched MCQs as the response
    res.status(200).json(mcqs);
  } catch (error) {
    console.error('Error fetching MCQs:', error);
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
