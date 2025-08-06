const express = require("express");
const router = express.Router();
const Section = require("../models/Section");

// Get all uections
router.get("/", async (req, res) => {
  console.log("hit");
  const uections = await Section.find();
  res.json(uections);
});

// Get one uection
router.get("/:id", async (req, res) => {
  const uection = await Section.findById(req.params.id);
  res.json(uection);
});

// Create uection
router.post("/", async (req, res) => {
  const uection = new Section(req.body);
  const savedSection = await uection.save();
  res.status(201).json(savedSection);
});

// Update uection
router.put("/:id", async (req, res) => {
  const updated = await Section.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete uection
router.delete("/:id", async (req, res) => {
  await Section.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
