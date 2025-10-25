const express = require("express");
const router = express.Router();
const Material = require("../models/Material");
const { auth } = require("../middlewares/auth");

// text helper
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all materials
router.get("/", auth, async (req, res) => {
  const userRole = req.userRole;
  const search = req.query.search || "";
  const safeSearch = escapeRegex(search);
  const page = parseInt(req.query.currentPage);
  const size = parseInt(req.query.rowPerPage);

  const materials = await Material.find({
    ...(userRole === "User" ? { isActive: true } : {}),
    name: { $regex: safeSearch, $options: "i" },
  })
    .sort({ name: 1 })
    .skip(page * size)
    .limit(size)
    .populate({
      path: "uomId",
      options: { sort: { name: 1 } },
    })
    .then((data) => {
      Material.countDocuments({
        ...(userRole === "User" ? { isActive: true } : {}),
        name: { $regex: safeSearch, $options: "i" },
      })
        .then((count) => {
          const sendData = { data, totalCount: count };
          res.status(200).json({ data, totalCount: count });
        })
        .catch((countErr) => {
          console.error(countErr);
          res.status(500).json({ error: "Failed to count materials." });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Item not found." });
    });
});

// Get one material
router.get("/:id", auth, async (req, res) => {
  await Material.findById(req.params.id)
    .populate("uomId")
    .then((material) => {
      console.log(material);
      res.status(200).json(material);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Item not found." });
    });
});

// Create material
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const material = new Material(newItem);
  const savedMaterial = await material
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

// Update material
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await Material.findByIdAndUpdate(req.params.id, updatedData, {
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

// Delete material
router.delete("/:id", auth, async (req, res) => {
  await Material.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
