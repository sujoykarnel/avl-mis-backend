const express = require("express");
const router = express.Router();
const LineCapacity = require("../models/LineCapacity");

// Get all lineCapacitys
router.get("/", async (req, res) => {
  await LineCapacity.find()
    .populate("unitId")
    .populate("lineId")
    .populate("productId")
    .lean()
    .limit()
    .then((capacities) => {
      // console.log(capacities);
      res.status(200).json({ capacities });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Capacities not found." });
    });
});

// Get one lineCapacity
router.get("/:id", async (req, res) => {
  const lineCapacity = await LineCapacity.findById(req.params.id);
  res.json(lineCapacity);
});

// Create lineCapacity
router.post("/", async (req, res) => {
  const lineCapacity = new LineCapacity(req.body);
  const savedLineCapacity = await lineCapacity.save();
  res.status(201).json(savedLineCapacity);
});

// Update lineCapacity
router.put("/:id", async (req, res) => {
  const updated = await LineCapacity.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.json(updated);
});

// Delete lineCapacity
router.delete("/:id", async (req, res) => {
  await LineCapacity.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
