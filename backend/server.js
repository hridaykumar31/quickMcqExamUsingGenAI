require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const mcqRoutes = require("./routes/mcqRoutes");
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST",
    allowedHeaders: "Content-Type",
  })
);

app.use('/uploads', express.static('uploads'));
app.use(express.json());

const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/api/generate', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: error.message || "Failed to generate content" });
  }
});

app.get('/test', (req, res) => {
  res.send('Server is working');
});

app.use('/api', authRoutes);
app.use("/mcqs", mcqRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
