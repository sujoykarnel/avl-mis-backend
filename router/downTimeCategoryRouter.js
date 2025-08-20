const express = require("express");
const router = express.Router();
const DownTimeCategory = require("../models/DownTimeCategory");
const { auth } = require("../middlewares/auth");



// Get all downTimeCategorys
router.get("/", auth, async (req, res) => {
  console.log("hit");
  const downTimeCategorys = await DownTimeCategory.find();
  res.json(downTimeCategorys);
});

// Get one downTimeCategory
router.get("/:id", auth, async (req, res) => {
  const downTimeCategory = await DownTimeCategory.findById(req.params.id);
  res.json(downTimeCategory);
});

// Create downTimeCategory
router.post("/", auth, async (req, res) => {
  const downTimeCategory = new DownTimeCategory(req.body);
  const savedDownTimeCategory = await downTimeCategory
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

// Update downTimeCategory
router.patch("/:id", auth, async (req, res) => {
  const updated = await DownTimeCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  )
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

// Delete downTimeCategory
router.delete("/:id", auth, async (req, res) => {
  await DownTimeCategory.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
