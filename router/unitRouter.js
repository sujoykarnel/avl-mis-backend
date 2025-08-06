const express = require("express");
const router = express.Router();
const Unit = require("../models/Unit");

// Get all units
router.get("/", async (req, res) => {
  console.log("hit");
  const units = await Unit.find();
  res.json(units);
});

// Get one unit
router.get("/:id", async (req, res) => {
  const unit = await Unit.findById(req.params.id);
  res.json(unit);
});

// Create unit
router.post("/", async (req, res) => {
  const unit = new Unit(req.body);
  const savedUnit = await unit.save();
  res.status(201).json(savedUnit);
});

// Update unit
router.put("/:id", async (req, res) => {
  const updated = await Unit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete unit
router.delete("/:id", async (req, res) => {
  await Unit.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
