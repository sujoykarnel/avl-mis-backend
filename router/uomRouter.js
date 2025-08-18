const express = require("express");
const router = express.Router();
const Uom = require("../models/UoM");

// Get all uoms
router.get("/", async (req, res) => {
  await Uom.find()
    .populate()
    .limit()
    .then((uoms) => {
      console.log(uoms);
      res.status(200).json({ uoms });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "UoMs not found." });
    });
});

// Get one uom
router.get("/:id", async (req, res) => {
  const uom = await Uom.findById(req.params.id);
  res.json(uom);
});

// Create uom
router.post("/", async (req, res) => {
  const uom = new Uom(req.body);
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
router.put("/:id", async (req, res) => {
  const updated = await Uom.findByIdAndUpdate(req.params.id, req.body, {
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
router.delete("/:id", async (req, res) => {
  await Uom.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
