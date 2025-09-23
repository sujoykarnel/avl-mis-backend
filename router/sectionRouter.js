const express = require("express");
const router = express.Router();
const Section = require("../models/Section");
const { auth } = require("../middlewares/auth");

// text helper
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all sections
router.get("/", auth, async (req, res) => {
  const userRole = req.userRole;
  const search = req.query.search || "";
  const safeSearch = escapeRegex(search);
  const page = parseInt(req.query.currentPage);
  const size = parseInt(req.query.rowPerPage);

  await Section.find({
    ...(userRole === "User" ? { isActive: true } : {}),
    name: { $regex: safeSearch, $options: "i" },
  })
    .populate()
    .skip(page * size)
    .limit(size)
    .then((data) => {
      Section.countDocuments({
        ...(userRole === "User" ? { isActive: true } : {}),
        name: { $regex: safeSearch, $options: "i" },
      })
        .then((count) => {
          res.status(200).json({ data, totalCount: count });
        })
        .catch((countErr) => {
          console.error(countErr);
          res.status(500).json({ error: "Failed to count Sections." });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Sections not found." });
    });
});

// Get one section
router.get("/:id", auth, async (req, res) => {
  await Section.findById(req.params.id)
    .populate()
    .populate("createdById")
    .limit()
    .then((section) => {
      // console.log(section);
      res.status(200).json(section);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Section not found." });
    });
});

// Create section
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const section = new Section(newItem);
  const savedSection = await section
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

// Update section
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await Section.findByIdAndUpdate(req.params.id, updatedData, {
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

// Delete section
router.delete("/:id", auth, async (req, res) => {
  await Section.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
