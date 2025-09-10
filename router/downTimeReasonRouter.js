const express = require("express");
const router = express.Router();
const DownTimeReason = require("../models/DownTimeReason");
const { auth } = require("../middlewares/auth");

// Get all downTimeReasons
router.get("/", auth, (req, res) => {
  const userRole = req.userRole;
  const search = req.query.search || "";
  const page = parseInt(req.query.currentPage);
  const size = parseInt(req.query.rowPerPage);
  console.log(req);
  DownTimeReason.find({
    ...(userRole === "User" ? { isActive: true } : {}),
    name: { $regex: search, $options: "i" },
  })
    .populate("downTimeCategoryIds")
    .skip(page * size)
    .limit(size)
    .sort({ code: 1, name: 1 })
    .then((data) => {
      DownTimeReason.countDocuments({ name: { $regex: search, $options: "i" } })
        .then((count) => {
          const sendData = { data, totalCount: count };
          res.status(200).json({ data, totalCount: count });
        })
        .catch((countErr) => {
          console.error(countErr);
          res.status(500).json({ error: "Failed to count downTimeReasons." });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "DownTimeReason not found." });
    });
});

// Get one downTimeReason
router.get("/:id", auth, async (req, res) => {
  await DownTimeReason.findById(req.params.id)
    .populate("downTimeCategoryIds")
    .limit()
    .then((downTimeReason) => {
      console.log(downTimeReason);
      res.status(200).json(downTimeReason);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "DownTimeReason not found." });
    });
});

// Create downTimeReason
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const downTimeReason = new DownTimeReason(newItem);
  const savedDownTimeReason = await downTimeReason
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

// Update downTimeReason
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await DownTimeReason.findByIdAndUpdate(
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

// Delete downTimeReason
router.delete("/:id", auth, async (req, res) => {
  await DownTimeReason.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
