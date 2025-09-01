const express = require("express");
const router = express.Router();
const Line = require("../models/Line");
const { auth } = require("../middlewares/auth");

// Get all lines
router.get("/", auth, async (req, res) => {
  const search = req.query.search || "";
  await Line.aggregate([
    {
      $lookup: {
        from: "units",
        localField: "unitId",
        foreignField: "_id",
        as: "unit",
      },
    },
    { $unwind: "$unit" },
    {
      $lookup: {
        from: "sections",
        localField: "sectionId",
        foreignField: "_id",
        as: "section",
      },
    },
    { $unwind: "$section" },
    {
      $lookup: {
        from: "lineTypes",
        localField: "lineTypeId",
        foreignField: "_id",
        as: "lineType",
      },
    },
    { $unwind: "$lineType" },
    {
      $match: {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { "lineType.name": { $regex: search, $options: "i" } },
          { "unit.name": { $regex: search, $options: "i" } },
          { "section.name": { $regex: search, $options: "i" } },
        ],
      },
    },
    {
      $sort: {
        "unit.name": 1,
        "section.name": 1,
        name: 1,
        "lineType.name": 1,
      },
    },
  ])
    .then((lines) => {
      res.status(200).json(lines);
      console.log(lines);
    })
    .catch((err) => {
      onsole.log(err);
      res.status(404).json({ err, error: "Capacities not found." });
    });
});

// Get one line
router.get("/:id", auth, async (req, res) => {
  await Line.findById(req.params.id)
    .populate("unitId")
    .populate("sectionId")
    .populate("lineTypeId")
    .sort()
    .limit()
    .then((line) => {
      console.log(line);
      res.status(200).json(line);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Line not found." });
    });
});

// Create line
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const line = new Line(newItem);
  const savedLine = await line
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

// Update line
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await Line.findByIdAndUpdate(req.params.id, updatedData, {
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

// Delete line
router.delete("/:id", auth, async (req, res) => {
  await Line.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
