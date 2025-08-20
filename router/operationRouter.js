const express = require("express");
const router = express.Router();
const Operation = require("../models/LineOperation");
const { auth } = require("../middlewares/auth");

// Get all operations
router.get("/", auth, async (req, res) => {
  console.log("hit");
  const operations = await Operation.find();
  res.json(operations);
});

// Get one operation
router.get("/:id", auth, async (req, res) => {
  const operation = await Operation.findById(req.params.id);
  res.json(operation);
});

// Create operation
router.post("/", auth, async (req, res) => {
  const operation = new Operation(req.body);
  const savedOperation = await operation
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

// Update operation
router.put("/:id", auth, async (req, res) => {
  const updated = await Operation.findByIdAndUpdate(req.params.id, req.body, {
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

// Delete operation
router.delete("/:id", auth, async (req, res) => {
  await Operation.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
