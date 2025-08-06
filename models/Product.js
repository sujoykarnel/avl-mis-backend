const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sku: {
      type: Number,
      required: true,
    },
    uom: {
      type: String,
      required: true,
    },
    pcsPerUom: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdByEnroll: {
      type: Number,
      required: true,
    },
  },
  {
    Timestamp: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
