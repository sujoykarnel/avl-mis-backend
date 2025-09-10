const express = require("express");
const router = express.Router();
const LineType = require("../models/LineType");
const { auth } = require("../middlewares/auth");



// Get all lineTypes
router.get("/", auth, async (req, res) => {
  const search = req.query.search || "";
  const lineTypes = await LineType.find({
    name: { $regex: search, $options: "i" },
  })
    .populate()
    .populate("createdById")
    .limit()
    .then((lineTypes) => {
      // console.log(lineTypes);
      res.status(200).json(lineTypes);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "LineType not found." });
    });
});

// Get one lineType
router.get("/:id", auth, async (req, res) => {
  await LineType.findById(req.params.id)
    .populate()
    .populate("createdById")
    .limit()
    .then((lineType) => {
      // console.log(lineType);
      res.status(200).json(lineType);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "LineType not found." });
    });
});

// Create lineType
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const lineType = new LineType(newItem);
  const savedLineType = await lineType
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

// Update lineType
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await LineType.findByIdAndUpdate(req.params.id, updatedData, {
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

// Delete lineType
router.delete("/:id", auth, async (req, res) => {
  await LineType.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
