const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text:   { type: String, required: true },
  time:   { type: String, default: "just now" },
});

// ── Answer Schema ─────────────────────────────────────────────
const answerSchema = new mongoose.Schema({
  questionId:   { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  body:         { type: String, required: true },
  upvotes:      { type: Number, default: 0 },
  downvotes:    { type: Number, default: 0 },
  answeredBy:   { type: String, required: true },
  answeredTime: { type: String, default: "just now" },
  accepted:     { type: Boolean, default: false },
  comments:     { type: [commentSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Answer", answerSchema);