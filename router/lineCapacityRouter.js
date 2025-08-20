const express = require("express");
const router = express.Router();
const Capacity = require("../models/LineCapacity");
const { mongoose } = require("mongoose");
const { auth } = require("../middlewares/auth");

// Get all capacities
router.get("/", auth, async (req, res) => {
  const search = req.query.search || "";
  let lineIds = req.query.lineIds || [];

  // Ensure array
  if (typeof lineIds === "string") {
    lineIds = lineIds.split(",");
  }
  const objectLineIds = lineIds.map((id) => new mongoose.Types.ObjectId(id));

  await Capacity.aggregate([
    {
      $match: {
        lineId: { $in: objectLineIds },
      },
    },
    {
      $lookup: {
        from: "lines",
        localField: "lineId",
        foreignField: "_id",
        as: "line",
      },
    },
    { $unwind: "$line" },
    {
      $lookup: {
        from: "units",
        localField: "line.unitId",
        foreignField: "_id",
        as: "unit",
      },
    },
    { $unwind: "$unit" },
    {
      $lookup: {
        from: "sections",
        localField: "line.sectionId",
        foreignField: "_id",
        as: "section",
      },
    },
    { $unwind: "$section" },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "uoms",
        localField: "product.primaryUomId",
        foreignField: "_id",
        as: "uom",
      },
    },
    { $unwind: "$uom" },
    {
      $match: {
        $or: [
          { "line.name": { $regex: search, $options: "i" } },
          { "product.name": { $regex: search, $options: "i" } },
          { "unit.name": { $regex: search, $options: "i" } },
          { "section.name": { $regex: search, $options: "i" } },
        ],
      },
    },
  ])
    .then((capacities) => {
      res.status(200).json(capacities);
      // console.log(capacities);
    })
    .catch((err) => {
      onsole.log(err);
      res.status(404).json({ err, error: "Capacities not found." });
    });
});

// Get one capacity
router.get("/:id", auth, async (req, res) => {
  console.log("hit");
  const id = req.params.id;
  const capacity = await Capacity.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "lines",
        localField: "lineId",
        foreignField: "_id",
        as: "line",
      },
    },
    { $unwind: "$line" },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "uoms",
        localField: "product.primaryUomId",
        foreignField: "_id",
        as: "uom",
      },
    },
    { $unwind: "$uom" },
  ])
    .then((capacity) => {
      // console.log(capacity);
      res.status(200).json(capacity);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Capacity not found." });
    });
});

// Create capacity
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const capacity = new Capacity(newItem);
  const savedCapacity = await capacity
    .save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      // console.log(err.code);
      if (err.code === 11000) {
        res.status(409).json({ err, error: "Duplicate" });
      }
      res.status(404).json({
        err,
        error: "Item not found.",
      });
    });
});

// Update capacity
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await Capacity.findByIdAndUpdate(req.params.id, updatedData, {
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

// Delete capacity
router.delete("/:id", auth, async (req, res) => {
  await Capacity.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
