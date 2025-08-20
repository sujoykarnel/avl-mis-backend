const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { auth } = require("../middlewares/auth");

// Get all products
router.get("/", auth, async (req, res) => {
  const search = req.query.search || "";

  const products = await Product.find({
    name: { $regex: search, $options: "i" },
  })
    .populate("primaryUomId")
    .populate("secondaryUomId")
    .populate("createdById")
    .limit()
    .then((products) => {
      // console.log(products);
      res.status(200).json(products);
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
      console.log(product);
      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Product not found." });
    });
});

// Create product
router.post("/", auth, async (req, res) => {
  const product = new Product(req.body);
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
  // console.log(req.body);
  console.log(req.params.id, req.body);
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
