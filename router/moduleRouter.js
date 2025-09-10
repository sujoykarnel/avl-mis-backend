const express = require("express");
const router = express.Router();
const Module = require("../models/Module");
const { auth } = require("../middlewares/auth");

// Get all modules
router.get("/", auth, async (req, res) => {
  const search = req.query.search || "";
  const modules = await Module.find({
    name: { $regex: search, $options: "i" },
  })
    .populate()
    .populate("createdById")
    .limit()
    .then((modules) => {
      // console.log(modules);
      res.status(200).json(modules);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "UoMs not found." });
    });
});

// Get one module
router.get("/:id", auth, async (req, res) => {
  await Module.findById(req.params.id)
    .populate()
    .populate("createdById")
    .limit()
    .then((module) => {
      // console.log(module);
      res.status(200).json(module);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Module not found." });
    });
});

// Create module
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const module = new Module(newItem);
  const savedModule = await module
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

// Update module
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await Module.findByIdAndUpdate(req.params.id, updatedData, {
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

// Delete module
router.delete("/:id", auth, async (req, res) => {
  await Module.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
