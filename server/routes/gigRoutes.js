const express = require("express");
const router = express.Router();
const Gig = require("../models/Gig");

// ✅ POST a new gig
router.post("/create", async (req, res) => {
  const { title, description, requiredSkills, location, role } = req.body;
  try {
    const newGig = new Gig({ title, description, requiredSkills, location, role });
    await newGig.save();
    res.status(201).json(newGig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ APPLY to a gig (updated to accept JSON — not file)
router.post("/:id/apply", async (req, res) => {
  const { name, phone, message, resume, skills } = req.body;

  if (!name || !phone || !resume) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // Prevent duplicate phone
    const alreadyApplied = gig.applicants.find(app => app.phone === phone);
    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    gig.applicants.push({
      name,
      phone,
      message,
      resume,
      skills: Array.isArray(skills) ? skills : (skills || "").split(",").map(s => s.trim()),
    });

    await gig.save();
    res.json({ message: "Applied successfully", gig });
  } catch (err) {
    res.status(500).json({ message: "Error applying", error: err.message });
  }
});

// ✅ GET all gigs (with optional filters)
router.get("/", async (req, res) => {
  const { location, skill } = req.query;
  let filter = {};
  if (location) filter.location = location;
  if (skill) filter.requiredSkills = { $in: [skill] };

  try {
    const gigs = await Gig.find(filter);
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;