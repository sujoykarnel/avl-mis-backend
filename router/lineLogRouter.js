const express = require("express");
const router = express.Router();
const LineLog = require("../models/LineLog");
const { mongoose } = require("mongoose");
const { auth } = require("../middlewares/auth");

// text helper
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all lineLogs
router.get("/", auth, async (req, res) => {
  const userRole = req.userRole;
  const search = req.query.search || "";
  const page = parseInt(req.query.currentPage);
  const size = parseInt(req.query.rowPerPage);
  let lineIds = req.query.lineIds || [];
  const logFrom = new Date(req.query.logFrom);
  const logTo = new Date(req.query.logTo);

  // Ensure array
  if (typeof lineIds === "string") {
    lineIds = lineIds.split(",");
  }
  const objectLineIds = lineIds.map((id) => new mongoose.Types.ObjectId(id));
  // console.log("lineLogs", logFrom, logTo);

  const basePipeline = [
    {
      $lookup: {
        from: "lineCapacities",
        localField: "capacityId",
        foreignField: "_id",
        as: "capacity",
      },
    },
    { $unwind: { path: "$capacity", preserveNullAndEmptyArrays: true } },
    ...(objectLineIds.length > 0
      ? [
          {
            $match: {
              "capacity.lineId": { $in: objectLineIds },
            },
          },
        ]
      : []),
    {
      $match: {
        fromDateTime: { $gte: logFrom, $lte: logTo },
      },
    },
    {
      $lookup: {
        from: "lines",
        localField: "capacity.lineId",
        foreignField: "_id",
        as: "line",
      },
    },
    { $unwind: { path: "$line", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "lineTypes",
        localField: "line.lineTypeId",
        foreignField: "_id",
        as: "lineType",
      },
    },
    { $unwind: { path: "$lineType", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "units",
        localField: "line.unitId",
        foreignField: "_id",
        as: "unit",
      },
    },
    { $unwind: { path: "$unit", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "sections",
        localField: "line.sectionId",
        foreignField: "_id",
        as: "section",
      },
    },
    { $unwind: { path: "$section", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "products",
        localField: "capacity.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "uoms",
        localField: "product.primaryUomId",
        foreignField: "_id",
        as: "primaryUom",
      },
    },
    { $unwind: { path: "$primaryUom", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "uoms",
        localField: "product.secondaryUomId",
        foreignField: "_id",
        as: "secondaryUom",
      },
    },
    { $unwind: { path: "$secondaryUom", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "lineOperations",
        localField: "operationId",
        foreignField: "_id",
        as: "operation",
      },
    },
    { $unwind: { path: "$operation", preserveNullAndEmptyArrays: true } },
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
    { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        "createdBy.password": 0,
      },
    },
    { $sort: { createdAt: -1 } },
  ];

  if (search) {
    const safeSearch = escapeRegex(search);

    basePipeline.push({
      $match: {
        $or: [
          { "line.name": { $regex: safeSearch, $options: "i" } },
          { "product.name": { $regex: safeSearch, $options: "i" } },
          { "unit.name": { $regex: safeSearch, $options: "i" } },
          { "section.name": { $regex: safeSearch, $options: "i" } },
        ],
      },
    });
  }

  let dataPipeline = [];

  if (page >= 0 && size) {
    dataPipeline = [...basePipeline, { $skip: page * size }, { $limit: size }];
  } else {
    dataPipeline = [...basePipeline];
  }

  const countPipeline = [...basePipeline, { $count: "total" }];

  const lastPipeline = [
    // first join capacity
    {
      $lookup: {
        from: "lineCapacities",
        localField: "capacityId",
        foreignField: "_id",
        as: "capacity",
      },
    },
    { $unwind: "$capacity" },

    // now filter by lineId
    ...(objectLineIds.length > 0
      ? [{ $match: { "capacity.lineId": { $in: objectLineIds } } }]
      : []),

    { $sort: { createdAt: -1 } },
    { $limit: 1 },
  ];

  Promise.all([
    LineLog.aggregate(dataPipeline),
    LineLog.aggregate(countPipeline),
    LineLog.aggregate(lastPipeline),
  ])
    .then(([data, countArr, lastLogArr]) => {
      const totalCount = countArr[0]?.total || 0;
      const lastLog = lastLogArr[0] || null;
      // console.log("lineLog", lastLog);
      res.status(200).json({ data, totalCount, lastLog });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "LineLog not found." });
    });
});

// Get one lineLog
router.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const lineLog = await LineLog.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
        as: "primaryUom",
      },
    },
    { $unwind: "$primaryUom" },
    {
      $lookup: {
        from: "uoms",
        localField: "product.secondaryUomId",
        foreignField: "_id",
        as: "secondaryUom",
      },
    },
    { $unwind: "$secondaryUom" },
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
    { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        "createdBy.password": 0,
      },
    },
  ])
    .then((lineLog) => {
      res.status(200).json(lineLog);
      // console.log(lineLogs);
    })
    .catch((err) => {
      onsole.log(err);
      res.status(404).json({ err, error: "LineLogs not found." });
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
