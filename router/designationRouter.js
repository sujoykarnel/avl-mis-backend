const express = require("express");
const router = express.Router();
const Designation = require("../models/Designation");



// Get all designations
router.get("/", async (req, res) => {
  const search = req.query.search || "";
  const designations = await Designation.find({
    name: { $regex: search, $options: "i" },
  })
    .populate()
    .populate("createdById")
    .limit()
    .then((designations) => {
      // console.log(designations);
      res.status(200).json(designations);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "UoMs not found." });
    });
});

// Get one designation
router.get("/:id", async (req, res) => {
  await Designation.findById(req.params.id)
    .populate()
    .populate("createdById")
    .limit()
    .then((designation) => {
      console.log(designation);
      res.status(200).json(designation);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Designation not found." });
    });
});

// Create designation
router.post("/", async (req, res) => {
  const designation = new Designation(req.body);
  const savedDesignation = await designation
    .save()
    .then(() => {
      res.status(201).json(savedDesignation);
    })
    .catch((err) => {
      console.log(err.code);
      if (err.code === 11000) {
        res.status(409).json({ err, error: "Duplicate" });
      }
      res.status(404).json({
        err,
        error: `Duplicate value for field: ${Object.keys(err.keyValue)}`,
      });
    });
});

// Update designation
router.patch("/:id", async (req, res) => {
  // console.log(req.body);
  console.log(req.params.id, req.body);
  const updated = await Designation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete designation
router.delete("/:id", async (req, res) => {
  await Designation.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
