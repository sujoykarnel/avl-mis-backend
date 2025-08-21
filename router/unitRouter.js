const express = require("express");
const router = express.Router();
const Unit = require("../models/Unit");
const { auth } = require("../middlewares/auth");

// Get all units
router.get("/", auth, async (req, res) => {
  const search = req.query.search || "";
  const units = await Unit.find({
    name: { $regex: search, $options: "i" },
  })
    .populate()
    .limit()
    .then((units) => {
      // console.log(units);
      res.status(200).json(units);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Item not found." });
    });
});

// Get one unit
router.get("/:id", auth, async (req, res) => {
  console.log(req.params.id)
  await Unit.findById(req.params.id)
    .populate()
    .limit()
    .then((unit) => {
      console.log(unit);
      res.status(200).json(unit);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Item not found." });
    });
});

// Create unit
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const unit = new Unit(newItem);
  const savedUnit = await unit
    .save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err.code);
      if (err.code === 11000) {
        res.status(409).json({ err, error: "Duplicate" });
      }
      res.status(404).json({
        err,
        error: "Item not found.",
      });
    });
});

// Update unit
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await Unit.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
  })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err.code);
      if (err.code === 11000) {
        res.status(409).json({ err, error: "Duplicate" });
      }
      res.status(404).json({
        err,
        error: "Item not found.",
      });
    });
});

// Delete unit
router.delete("/:id", auth, async (req, res) => {
  await Unit.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
