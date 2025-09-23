const express = require("express");
const router = express.Router();
const Uom = require("../models/Uom");
const { auth } = require("../middlewares/auth");

// text helper
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all uoms
router.get("/", auth, async (req, res) => {
  const userRole = req.userRole;
  const search = req.query.search || "";
  const safeSearch = escapeRegex(search);
  const page = parseInt(req.query.currentPage);
  const size = parseInt(req.query.rowPerPage);

  await Uom.find({
    ...(userRole === "User" ? { isActive: true } : {}),
    name: { $regex: safeSearch, $options: "i" },
  })
    .populate()
    .skip(page * size)
    .limit(size)
    .then((data) => {
      Uom.countDocuments({
        ...(userRole === "User" ? { isActive: true } : {}),
        name: { $regex: safeSearch, $options: "i" },
      })
        .then((count) => {
          res.status(200).json({ data, totalCount: count });
        })
        .catch((countErr) => {
          console.error(countErr);
          res.status(500).json({ error: "Failed to count Uoms." });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Uoms not found." });
    });
});

// Get one uom
router.get("/:id", auth, async (req, res) => {
  const uom = await Uom.findById(req.params.id);
  res.json(uom);
});

// Create uom
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const uom = new Uom(newItem);
  const savedUom = await uom
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

// Update uom
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await Uom.findByIdAndUpdate(req.params.id, updatedData, {
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

// Delete uom
router.delete("/:id", auth, async (req, res) => {
  await Uom.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
