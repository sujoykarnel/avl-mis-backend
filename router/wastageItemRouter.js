const express = require("express");
const router = express.Router();
const WastageItem = require("../models/WastageItem");
const { auth } = require("../middlewares/auth");

// Get all wastageItems
router.get("/", async (req, res) => {
  const search = req.query.search || "";
  const page = parseInt(req.query.currentPage);
  const size = parseInt(req.query.rowPerPage);

  await WastageItem.find({
    name: { $regex: search, $options: "i" },
  })
    .populate()
    .skip(page * size)
    .limit(size)
    .then((data) => {
      WastageItem.countDocuments({ name: { $regex: search, $options: "i" } })
        .then((count) => {
          res.status(200).json({ data, totalCount: count });
        })
        .catch((countErr) => {
          console.error(countErr);
          res.status(500).json({ error: "Failed to count Wastage Items." });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Wastage Items not found." });
    });
});

// Get one wastageItem
router.get("/:id", auth, async (req, res) => {
  await WastageItem.findById(req.params.id)
    .populate()
    .then((wastageItem) => {
      
      res.status(200).json(wastageItem);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Item not found." });
    });
});

// Create wastageItem
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const wastageItem = new WastageItem(newItem);
  const savedWastageItem = await wastageItem
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

// Update wastageItem
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await WastageItem.findByIdAndUpdate(
    req.params.id,
    updatedData,
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

// Delete wastageItem
router.delete("/:id", auth, async (req, res) => {
  await WastageItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
