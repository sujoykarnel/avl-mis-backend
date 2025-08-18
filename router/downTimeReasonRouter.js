const express = require("express");
const router = express.Router();
const Reason = require("../models/DownTimeReason");

// Get all reasons
router.get("/", async (req, res) => {
  console.log("hit");
  const reasons = await Reason.find();
  res.json(reasons);
});

// Get one reason
router.get("/:id", async (req, res) => {
  const reason = await Reason.findById(req.params.id);
  res.json(reason);
});

// Create reason
router.post("/", async (req, res) => {
  const reason = new Reason(req.body);
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
router.patch("/:id", async (req, res) => {
  const updated = await Reason.findByIdAndUpdate(req.params.id, req.body, {
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
router.delete("/:id", async (req, res) => {
  await Reason.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
