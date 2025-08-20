const express = require("express");
const router = express.Router();
const Section = require("../models/Section");
const { auth } = require("../middlewares/auth");

// Get all sections
router.get("/", auth, async (req, res) => {
  const search = req.query.search || "";
  const sections = await Section.find({
    name: { $regex: search, $options: "i" },
  })
    .populate()
    .populate("createdById")
    .limit()
    .then((sections) => {
      // console.log(sections);
      res.status(200).json(sections);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Section not found." });
    });
});

// Get one section
router.get("/:id", auth, async (req, res) => {
  await Section.findById(req.params.id)
    .populate()
    .populate("createdById")
    .limit()
    .then((section) => {
      console.log(section);
      res.status(200).json(section);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Section not found." });
    });
});

// Create section
router.post("/", auth, async (req, res) => {
  const section = new Section(req.body);
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
  // console.log(req.body);
  console.log(req.params.id, req.body);
  const updated = await Section.findByIdAndUpdate(req.params.id, req.body, {
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
