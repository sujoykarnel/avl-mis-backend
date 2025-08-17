const express = require("express");
const router = express.Router();
const DownTimeCategory = require("../models/DownTimeCategory");



// Get all downTimeCategorys
router.get("/", async (req, res) => {
  console.log("hit");
  const downTimeCategorys = await DownTimeCategory.find();
  res.json(downTimeCategorys);
});

// Get one downTimeCategory
router.get("/:id", async (req, res) => {
  const downTimeCategory = await DownTimeCategory.findById(req.params.id);
  res.json(downTimeCategory);
});

// Create downTimeCategory
router.post("/", async (req, res) => {
  const downTimeCategory = new DownTimeCategory(req.body);
  const savedDownTimeCategory = await downTimeCategory.save();
  res.status(201).json(savedDownTimeCategory);
});

// Update downTimeCategory
router.put("/:id", async (req, res) => {
  const updated = await DownTimeCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.json(updated);
});

// Delete downTimeCategory
router.delete("/:id", async (req, res) => {
  await DownTimeCategory.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
