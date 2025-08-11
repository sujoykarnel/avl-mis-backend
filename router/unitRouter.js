const express = require("express");
const router = express.Router();
const Unit = require("../models/Unit");

// Get all units
router.get("/", async (req, res) => {
  const search = req.query.search || "";
  const units = await Unit.find({
    name: { $regex: search, $options: "i" },
  })
    .populate()
    .populate("createdById")
    .limit()
    .then((units) => {
      console.log(units);
      res.status(200).json(units);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Unit not found." });
    });
});

// Get one unit
router.get("/:id", async (req, res) => {
  await Unit.findById(req.params.id)
    .populate()
    .populate("createdById")
    .limit()
    .then((unit) => {
      console.log(unit);
      res.status(200).json(unit);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Unit not found." });
    });
});

// Create unit
router.post("/", async (req, res) => {
  const unit = new Unit(req.body);
  const savedUnit = await unit.save();
  res.status(201).json(savedUnit);
});

// Update unit
router.patch("/:id", async (req, res) => {
  // console.log(req.body);
  console.log(req.params.id, req.body);
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
