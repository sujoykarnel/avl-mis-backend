const express = require("express");
const router = express.Router();
const LineOperation = require("../models/LineOperation");

// Get all lineOperations
router.get("/", async (req, res) => {
  console.log("hit");
  const lineOperations = await LineOperation.find();
  res.json(lineOperations);
});

// Get one lineOperation
router.get("/:id", async (req, res) => {
  const lineOperation = await LineOperation.findById(req.params.id);
  res.json(lineOperation);
});

// Create lineOperation
router.post("/", async (req, res) => {
  const lineOperation = new LineOperation(req.body);
  const savedLineOperation = await lineOperation.save();
  res.status(201).json(savedLineOperation);
});

// Update lineOperation
router.put("/:id", async (req, res) => {
  const updated = await LineOperation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete lineOperation
router.delete("/:id", async (req, res) => {
  await LineOperation.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
