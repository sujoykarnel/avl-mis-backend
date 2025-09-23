const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { auth } = require("../middlewares/auth");

// text helper
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all products
router.get("/", auth, (req, res) => {
  const userRole = req.userRole;
  const search = req.query.search || "";
  const safeSearch = escapeRegex(search);
  const page = parseInt(req.query.currentPage);
  const size = parseInt(req.query.rowPerPage);
  Product.find({
    ...(userRole === "User" ? { isActive: true } : {}),
    name: { $regex: safeSearch, $options: "i" },
  })
    .populate("primaryUomId")
    .populate("secondaryUomId")
    .populate("createdById")
    .skip(page * size)
    .limit(size)
    .then((data) => {
      Product.countDocuments({
        ...(userRole === "User" ? { isActive: true } : {}),
        name: { $regex: safeSearch, $options: "i" },
      })
        .then((count) => {
          const sendData = { data, totalCount: count };
          res.status(200).json({ data, totalCount: count });
        })
        .catch((countErr) => {
          console.error(countErr);
          res.status(500).json({ error: "Failed to count products." });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Product not found." });
    });
});



// Get one product
router.get("/:id", auth, async (req, res) => {
  await Product.findById(req.params.id)
    .populate("primaryUomId")
    .populate("secondaryUomId")
    .populate("createdById")
    .limit()
    .then((product) => {
      // console.log(product);
      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Product not found." });
    });
});

// Create product
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const product = new Product(newItem);
  const savedProduct = await product
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

// Update product
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, {
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

// Delete product
router.delete("/:id", auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
