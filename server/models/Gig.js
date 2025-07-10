const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  title: String,
  description: String,
  requiredSkills: [String],
  location: String,
  role: String,
  applicants: [
    {
      name: String,
      phone: String,
      resume: String,
      message: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Gig", gigSchema);