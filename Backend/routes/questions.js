const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const protect = require("../middleware/auth");

router.post("/", protect, async(req, res) =>{
  try{
    const {title, body, tags} = req.body;

    if(!title || !body){
      return res.status(400).json({error: "title and body are required"});
    }
    const question = new Question({
      title,
      body,
      excerpt: body.slice(0, 100) + "...",
      tags: tags || [],
      askedBy: req.user.name,
      askedTime: "just now",
      timeAgo: "just now",
    });
    await question.save()
     const io = req.app.get("io");
    io.emit("newQuestion", question);
    res.status(201).json(question);
  }
  catch (err) {
    res.status(500).json({error: "failed to create question"})
  }
})

// ── GET all questions 
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 }); // newest first
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// ── GET a single question by ID
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question" });
  }
});

// ── POST upvote a question 
router.post("/:id/upvote", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } }, // $inc increments by 1
      { new: true }             // returns the updated document
    );
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json({ upvotes: question.upvotes });
  } catch (err) {
    res.status(500).json({ error: "Failed to upvote" });
  }
});

module.exports = { router };