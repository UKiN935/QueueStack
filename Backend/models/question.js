const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  body:      { type: String, required: true },
  excerpt:   { type: String },
  tags:      { type: [String], default: [] },
  upvotes:   { type: Number, default: 0 },
  answers:   { type: Number, default: 0 },
  views:     { type: Number, default: 0 },
  answered:  { type: Boolean, default: false },
  askedBy:   { type: String, required: true },
  askedTime: { type: String, default: "just now" },
  timeAgo:   { type: String, default: "just now" },
}, { timestamps: true }); // automatically adds createdAt and updatedAt

module.exports = mongoose.model("question", questionSchema);