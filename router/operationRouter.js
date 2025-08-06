const express = require("express");
const router = express.Router();
const Operation = require("../models/LineOperation");

// Get all operations
router.get("/", async (req, res) => {
  console.log("hit");
  const operations = await Operation.find();
  res.json(operations);
});

// Get one operation
router.get("/:id", async (req, res) => {
  const operation = await Operation.findById(req.params.id);
  res.json(operation);
});

// Create operation
router.post("/", async (req, res) => {
  const operation = new Operation(req.body);
  const savedOperation = await operation.save();
  res.status(201).json(savedOperation);
});

// Update operation
router.put("/:id", async (req, res) => {
  const updated = await Operation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete operation
router.delete("/:id", async (req, res) => {
  await Operation.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
