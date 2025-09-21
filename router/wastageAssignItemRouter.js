const express = require("express");
const router = express.Router();
const WastageAssignItem = require("../models/WastageAssignItem");
const { auth } = require("../middlewares/auth");
const { default: mongoose } = require("mongoose");

// Get all wastageAssignItems
router.get("/", auth, async (req, res) => {
  const userRole = req.userRole;
  const search = req.query.search || "";
  const page = parseInt(req.query.currentPage);
  const size = parseInt(req.query.rowPerPage);
  let unitIds = req.query.unitId || [];

  console.log(unitIds);

  // Ensure array
  if (typeof unitIds === "string") {
    unitIds = unitIds.split(",");
  }
  const objectUnitIds = unitIds.map((id) => new mongoose.Types.ObjectId(id));

  const basePipeline = [
    {
      $match: {
        ...(userRole === "User" ? { isActive: true } : {}),
        ...(objectUnitIds.length > 0 ? { unitId: { $in: objectUnitIds } } : {}),
      },
    },
    {
      $lookup: {
        from: "units",
        localField: "unitId",
        foreignField: "_id",
        as: "unit",
      },
    },
    { $unwind: { path: "$unit", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "wastageTypes",
        localField: "wastageTypeId",
        foreignField: "_id",
        as: "wastageType",
      },
    },
    { $unwind: { path: "$wastageType", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "materials",
        localField: "materialId",
        foreignField: "_id",
        as: "material",
      },
    },
    { $unwind: { path: "$material", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "uoms",
        localField: "material.uomId",
        foreignField: "_id",
        as: "uom",
      },
    },
    { $unwind: { path: "$uom", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "wastageItems",
        localField: "wastageItemId",
        foreignField: "_id",
        as: "wastageItem",
      },
    },
    { $unwind: { path: "$wastageItem", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "createdById",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        "createdBy.password": 0,
      },
    },
  ];

  if (search) {
    basePipeline.push({
      $match: {
        $or: [
          { "unit.name": { $regex: search, $options: "i" } },
          { "wastageType.name": { $regex: search, $options: "i" } },
          { "material.name": { $regex: search, $options: "i" } },
          { "wastageItem.name": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  let dataPipeline = [];

  const sortStage = {
    $sort: {
      "unit.name": 1,
      "wastageType.name": 1,
      "material.name": 1,
      "wastageItem.name": 1,
    },
  };

  if (page >= 0 && size) {
    dataPipeline = [
      ...basePipeline,
      sortStage,
      { $skip: page * size },
      { $limit: size },
    ];
  } else {
    dataPipeline = [...basePipeline];
  }

  const countPipeline = [...basePipeline, { $count: "total" }];

  Promise.all([
    WastageAssignItem.aggregate(dataPipeline),
    WastageAssignItem.aggregate(countPipeline),
  ])
    .then(([data, countArr]) => {
      const totalCount = countArr[0]?.total || 0;
      // console.log(data, totalCount);

      res.status(200).json({ data, totalCount });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "LineLog not found." });
    });
});

// Get one wastageAssignItem
router.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const wastageAssignItem = await WastageAssignItem.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "units",
        localField: "unitId",
        foreignField: "_id",
        as: "unit",
      },
    },
    { $unwind: { path: "$unit", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "wastageTypes",
        localField: "wastageTypeId",
        foreignField: "_id",
        as: "wastageType",
      },
    },
    { $unwind: { path: "$wastageType", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "materials",
        localField: "materialId",
        foreignField: "_id",
        as: "material",
      },
    },
    { $unwind: { path: "$material", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "uoms",
        localField: "material.uomId",
        foreignField: "_id",
        as: "uom",
      },
    },
    { $unwind: { path: "$uom", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "wastageItems",
        localField: "wastageItemId",
        foreignField: "_id",
        as: "wastageItem",
      },
    },
    { $unwind: { path: "$wastageItem", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "createdById",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        "createdBy.password": 0,
      },
    },
  ])
    .then((wastageAssignItem) => {
      res.status(200).json(wastageAssignItem);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Item not found." });
    });
});

// Create wastageAssignItem
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const wastageAssignItem = new WastageAssignItem(newItem);
  const savedWastageAssignItem = await wastageAssignItem
    .save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err.code);
      if (err.code === 11000) {
        return res.status(409).json({ err, error: "Duplicate" });
      }
      res.status(404).json({
        err,
        error: "Item not found.",
      });
    });
});

// Update wastageAssignItem
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await WastageAssignItem.findByIdAndUpdate(
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
        res.status(201).json({ err, error: "Duplicate" });
      }
      res.status(404).json({
        err,
        error: "Item not found.",
      });
    });
});

// Delete wastageAssignItem
router.delete("/:id", auth, async (req, res) => {
  await WastageAssignItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
