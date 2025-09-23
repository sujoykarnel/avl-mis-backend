const express = require("express");
const router = express.Router();
const Capacity = require("../models/LineCapacity");
const { mongoose } = require("mongoose");
const { auth } = require("../middlewares/auth");

// text helper
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all capacities
router.get("/", auth, (req, res) => {
  const userRole = req.userRole;
  const search = req.query.search || "";
  
  const page = parseInt(req.query.currentPage);
  const size = parseInt(req.query.rowPerPage);
  const unitId = req.query.unitId;
  let lineIds = req.query.lineIds || [];

  // console.log("Capacity", unitId);

  // Ensure array
  if (typeof lineIds === "string") {
    lineIds = lineIds.split(",");
  }
  const objectLineIds = lineIds.map((id) => new mongoose.Types.ObjectId(id));

  const basePipeline = [
    {
      $match: {
        ...(userRole === "User" ? { isActive: true } : {}),
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
    { $unwind: { path: "$line", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        ...(unitId
          ? { "line.unitId": new mongoose.Types.ObjectId(unitId) }
          : {}),
      },
    },
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
        localField: "productId",
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

  const sortStage = {
    $sort: {
      "unit.name": 1,
      "section.name": 1,
      "line.name": 1,
      "lineType.name": 1,
      "product.name": 1,
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
    Capacity.aggregate(dataPipeline),
    Capacity.aggregate(countPipeline),
  ])
    .then(([data, countArr]) => {
      const totalCount = countArr[0]?.total || 0;
      res.status(200).json({ data, totalCount });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Capacities not found." });
    });
});

// Get one capacity
router.get("/:id", auth, async (req, res) => {
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
