const express = require("express");
const router = express.Router();
const InnerMachine = require("../models/InnerMachine");

// Get all innerMachines
router.get("/", async (req, res) => {
  console.log("hit");
  const innerMachines = await InnerMachine.find();
  res.json(innerMachines);
});

// Get one innerMachine
router.get("/:id", async (req, res) => {
  const innerMachine = await InnerMachine.findById(req.params.id);
  res.json(innerMachine);
});

// Create innerMachine
router.post("/", async (req, res) => {
  const innerMachine = new InnerMachine(req.body);
  const savedInnerMachine = await innerMachine
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

// Update innerMachine
router.patch("/:id", async (req, res) => {
  const updated = await InnerMachine.findByIdAndUpdate(
    req.params.id,
    req.body,
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

// Delete innerMachine
router.delete("/:id", async (req, res) => {
  await InnerMachine.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
