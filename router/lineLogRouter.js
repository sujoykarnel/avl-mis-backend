const express = require("express");
const router = express.Router();
const LineLog = require("../models/LineLog");
const { mongoose } = require("mongoose");
const { auth } = require("../middlewares/auth");

// Get all lineLogs
router.get("/", async (req, res) => {
  const search = req.query.search || "";
  let lineIds = req.query.lineId || [];

  console.log(lineIds);

  // Ensure array
  if (typeof lineIds === "string") {
    lineIds = lineIds.split(",");
  }
  const objectLineIds = lineIds.map((id) => new mongoose.Types.ObjectId(id));

  await LineLog.aggregate([
    {
      $lookup: {
        from: "lineCapacities",
        localField: "capacityId",
        foreignField: "_id",
        as: "capacity",
      },
    },
    { $unwind: "$capacity" },
    {
      $lookup: {
        from: "lines",
        localField: "capacity.lineId",
        foreignField: "_id",
        as: "line",
      },
    },
    { $unwind: "$line" },
    {
      $lookup: {
        from: "lineTypes",
        localField: "line.lineTypeId",
        foreignField: "_id",
        as: "lineType",
      },
    },
    { $unwind: "$lineType" },
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
        localField: "capacity.productId",
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
        from: "lineOperations",
        localField: "operationId",
        foreignField: "_id",
        as: "operation",
      },
    },
    { $unwind: "$operation" },
    {
      $lookup: {
        from: "downTimeCategories",
        localField: "downtimeCategoryId",
        foreignField: "_id",
        as: "downTimeCategory",
      },
    },
    {
      $unwind: { path: "$downTimeCategory", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "downTimeReasons",
        localField: "downtimeReasonId",
        foreignField: "_id",
        as: "downTimeReason",
      },
    },
    { $unwind: { path: "$downTimeReason", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "innerMachines",
        localField: "innerMachineId",
        foreignField: "_id",
        as: "innerMachine",
      },
    },
    { $unwind: { path: "$innerMachine", preserveNullAndEmptyArrays: true } },
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
        "line._id": { $in: objectLineIds },
      },
    },
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
    .then((lineLogs) => {
      res.status(200).json(lineLogs);
      // console.log(lineLogs);
    })
    .catch((err) => {
      onsole.log(err);
      res.status(404).json({ err, error: "LineLogs not found." });
    });
});

// Get one lineLog
router.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const lineLog = await LineLog.aggregate([
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
        from: "lineTypes",
        localField: "line.lineTypeId",
        foreignField: "_id",
        as: "lineType",
      },
    },
    { $unwind: "$lineType" },
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
    .then((lineLog) => {
      // console.log(lineLog);
      res.status(200).json(lineLog);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "LineLog not found." });
    });
});

// Create lineLog
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const lineLog = new LineLog(newItem);
  const savedLineLog = await lineLog
    .save()
    .then((data) => {
      // console.log(data);
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

// Update lineLog
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await LineLog.findByIdAndUpdate(req.params.id, updatedData, {
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

// Delete lineLog
router.delete("/:id", auth, async (req, res) => {
  await LineLog.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
