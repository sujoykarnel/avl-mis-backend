const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    sku: {
      type: Number,
      require: true,
    },
    uom: {
      type: String,
      require: true,
    },
    pcsPerUom: {
      type: Number,
      require: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdByEnroll: {
      type: Number,
      require: true,
    },
  },
  {
    Timestamp: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
