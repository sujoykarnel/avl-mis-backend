const express = require("express");
const router = express.Router();
const Capacity = require("../models/LineCapacity");
const { mongoose } = require("mongoose");




// Get all capacities
router.get("/", async (req, res) => {
  const search = req.query.search || "";
  let lineIds = req.query.lineIds || [];

  // Ensure array
  if (typeof lineIds === "string") {
    lineIds = lineIds.split(",");
    // console.log(lineIds);
  }
  const objectLineIds = lineIds.map((id) => new mongoose.Types.ObjectId(id));

  console.log(objectLineIds);
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
      $lookup: {
        from: "users",
        localField: "createdById",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    { $unwind: "$createdBy" },
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
    })
    .catch((err) => {
      onsole.log(err);
      res.status(404).json({ err, error: "Capacities not found." });
    });
});

// Get one capacity
router.get("/:id", async (req, res) => {
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
    {
      $lookup: {
        from: "users",
        localField: "createdById",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    { $unwind: "$createdBy" },
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
router.post("/", async (req, res) => {
  const capacity = new Capacity(req.body);
  const savedCapacity = await capacity.save();
  res.status(201).json(savedCapacity);
});

// Update capacity
router.patch("/:id", async (req, res) => {
  // console.log(req.body);
  console.log(req.params.id, req.body);
  const updated = await Capacity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete capacity
router.delete("/:id", async (req, res) => {
  await Capacity.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
