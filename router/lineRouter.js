const express = require("express");
const router = express.Router();
const Line = require("../models/Line");

// Get all Lines
router.get("/", async (req, res) => {
  await Line.find()
    .populate()
    .limit()
    .then((lines) => {
      console.log(lines);
      res.status(200).json({ lines });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Lines not found." });
    });
});

router.post("/", async (req, res) => {
  console.log("hit");
  const product = new Line(req.body);
  const savedProduct = await product.save();
  res.status(201).json(savedProduct);
});

module.exports = router;
