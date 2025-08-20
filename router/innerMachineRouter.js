const express = require("express");
const router = express.Router();
const InnerMachine = require("../models/InnerMachine");
const { auth } = require("../middlewares/auth");

// Get all innerMachines
router.get("/", auth, async (req, res) => {
  console.log("hit");
  const innerMachines = await InnerMachine.find();
  res.json(innerMachines);
});

// Get one innerMachine
router.get("/:id", auth, async (req, res) => {
  const innerMachine = await InnerMachine.findById(req.params.id);
  res.json(innerMachine);
});

// Create innerMachine
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const innerMachine = new InnerMachine(newItem);
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
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await InnerMachine.findByIdAndUpdate(
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

// Delete innerMachine
router.delete("/:id", auth, async (req, res) => {
  await InnerMachine.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
