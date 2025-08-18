const express = require("express");
const router = express.Router();
const Line = require("../models/Line");

// Get all lines
router.get("/", async (req, res) => {
  const search = req.query.search || "";
  const lines = await Line.find({
    name: { $regex: search, $options: "i" },
  })
    .populate("unitId")
    .populate("sectionId")
    .populate("lineTypeId")
    .populate("createdById")
    .sort({ unitId: 1, sectionId: 1, name: 1 })
    .limit()
    .then((lines) => {
      // console.log(lines);
      res.status(200).json(lines);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Line not found." });
    });
});

// Get one line
router.get("/:id", async (req, res) => {
  await Line.findById(req.params.id)
    .populate("unitId")
    .populate("sectionId")
    .populate("lineTypeId")
    .populate("createdById")
    .limit()
    .then((line) => {
      console.log(line);
      res.status(200).json(line);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Line not found." });
    });
});

// Create line
router.post("/", async (req, res) => {
  const line = new Line(req.body);
  const savedLine = await line
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

// Update line
router.patch("/:id", async (req, res) => {
  // console.log(req.body);
  console.log(req.params.id, req.body);
  const updated = await Line.findByIdAndUpdate(req.params.id, req.body, {
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

// Delete line
router.delete("/:id", async (req, res) => {
  await Line.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
