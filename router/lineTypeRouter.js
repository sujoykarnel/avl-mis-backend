const express = require("express");
const router = express.Router();
const LineType = require("../models/LineType");



// Get all lineTypes
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
  await LineType.findById(req.params.id)
    .populate()
    .populate("createdById")
    .limit()
    .then((lineType) => {
      console.log(lineType);
      res.status(200).json(lineType);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "LineType not found." });
    });
});

// Create lineType
router.post("/", async (req, res) => {
  const lineType = new LineType(req.body);
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
router.patch("/:id", async (req, res) => {
  // console.log(req.body);
  console.log(req.params.id, req.body);
  const updated = await LineType.findByIdAndUpdate(req.params.id, req.body, {
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
router.delete("/:id", async (req, res) => {
  await LineType.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
