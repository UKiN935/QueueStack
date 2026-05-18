const express = require("express");
const router = express.Router();
const Answer = require("../models/answer");
const Question = require("../models/question");

// ── GET all answers for a question ────────────────────────────
router.get("/:id/answers", async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.id });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch answers" });
  }
});

// ── POST a new answer ─────────────────────────────────────────
router.post("/:id/answers", async (req, res) => {
  try {
    const { body, author } = req.body;

    if (!body || !author) {
      return res.status(400).json({ error: "body and author are required" });
    }

    const answer = new Answer({
      questionId:   req.params.id,
      body,
      answeredBy:   author,
      answeredTime: "just now",
    });

    await answer.save(); // saves to MongoDB

    // increment answer count on the question
    await Question.findByIdAndUpdate(req.params.id, { 
      $inc: { answers: 1 },
      $set: {answered: true}
    });

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ error: "Failed to post answer" });
  }
});

module.exports = router;