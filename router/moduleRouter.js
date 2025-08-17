const express = require("express");
const router = express.Router();
const Module = require("../models/Module");

// Get all modules
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
  await Module.findById(req.params.id)
    .populate()
    .populate("createdById")
    .limit()
    .then((module) => {
      console.log(module);
      res.status(200).json(module);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Module not found." });
    });
});

// Create module
router.post("/", async (req, res) => {
  const module = new Module(req.body);
  const savedModule = await module
    .save()
    .then(() => {
      res.status(201).json(savedModule);
    })
    .catch((err) => {
      console.log(err.code);
      if (err.code === 11000) {
        res.status(409).json({ err, error: "Duplicate" });
      }
      res.status(404).json({
        err,
        error: `Duplicate value for field: ${Object.keys(err.keyValue)}`,
      });
    });
});

// Update module
router.patch("/:id", async (req, res) => {
  // console.log(req.body);
  console.log(req.params.id, req.body);
  const updated = await Module.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete module
router.delete("/:id", async (req, res) => {
  await Module.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
