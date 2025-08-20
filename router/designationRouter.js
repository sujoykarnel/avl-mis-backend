const express = require("express");
const router = express.Router();
const Designation = require("../models/Designation");
const { auth } = require("../middlewares/auth");

// Get all designations
router.get("/", auth, async (req, res) => {
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
router.get("/:id", auth, async (req, res) => {
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
router.post("/", auth, async (req, res) => {
  const designation = new Designation(req.body);
  const savedDesignation = await designation
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

// Update designation
router.patch("/:id", auth, async (req, res) => {
  // console.log(req.body);
  console.log(req.params.id, req.body);
  const updated = await Designation.findByIdAndUpdate(req.params.id, req.body, {
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

// Delete designation
router.delete("/:id", auth, async (req, res) => {
  await Designation.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
