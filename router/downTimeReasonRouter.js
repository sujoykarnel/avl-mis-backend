const express = require("express");
const router = express.Router();
const Reason = require("../models/DownTimeReason");
const { auth } = require("../middlewares/auth");

// Get all reasons
router.get("/", auth, async (req, res) => {
  console.log("hit");
  const reasons = await Reason.find();
  res.json(reasons);
});

// Get one reason
router.get("/:id", auth, async (req, res) => {
  const reason = await Reason.findById(req.params.id);
  res.json(reason);
});

// Create reason
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const reason = new Reason(newItem);
  const savedReason = await reason
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

// Update reason
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await Reason.findByIdAndUpdate(req.params.id, updatedData, {
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

// Delete reason
router.delete("/:id", auth, async (req, res) => {
  await Reason.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
