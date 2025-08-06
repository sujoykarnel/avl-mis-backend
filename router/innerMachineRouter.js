const express = require("express");
const router = express.Router();
const InnerMachine = require("../models/InnerMachine");

// Get all innerMachines
router.get("/", async (req, res) => {
  console.log("hit");
  const innerMachines = await InnerMachine.find();
  res.json(innerMachines);
});

// Get one innerMachine
router.get("/:id", async (req, res) => {
  const innerMachine = await InnerMachine.findById(req.params.id);
  res.json(innerMachine);
});

// Create innerMachine
router.post("/", async (req, res) => {
  const innerMachine = new InnerMachine(req.body);
  const savedInnerMachine = await innerMachine.save();
  res.status(201).json(savedInnerMachine);
});

// Update innerMachine
router.put("/:id", async (req, res) => {
  const updated = await InnerMachine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete innerMachine
router.delete("/:id", async (req, res) => {
  await InnerMachine.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
