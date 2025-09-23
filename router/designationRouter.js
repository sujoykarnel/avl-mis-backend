const express = require("express");
const router = express.Router();
const Designation = require("../models/Designation");
const { auth } = require("../middlewares/auth");

// text helper
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all designations
router.get("/", auth, async (req, res) => {
  const userRole = req.userRole;
  const search = req.query.search || "";
  const safeSearch = escapeRegex(search);
  const page = parseInt(req.query.currentPage) || null;
  const size = parseInt(req.query.rowPerPage) || null;

  const designation = await Designation.find({
    ...(userRole === "User" ? { isActive: true } : {}),
    name: { $regex: safeSearch, $options: "i" },
  })
    .populate("createdById")
    .skip(page * size)
    .limit(size)
    .then((data) => {
      Designation.countDocuments({
        ...(userRole === "User" ? { isActive: true } : {}),
        name: { $regex: safeSearch, $options: "i" },
      })
        .then((count) => {
          res.status(200).json({ data, totalCount: count });
        })
        .catch((countErr) => {
          console.error(countErr);
          res.status(500).json({ error: "Failed to count departments." });
        });
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
      // console.log(designation);
      res.status(200).json(designation);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Designation not found." });
    });
});

// Create designation
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const designation = new Designation(newItem);
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
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await Designation.findByIdAndUpdate(
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

// Delete designation
router.delete("/:id", auth, async (req, res) => {
  await Designation.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
