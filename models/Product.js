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
    primaryUomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Uom",
      required: true,
    },
    secondaryUomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Uom",
      required: true,
    },
    primaryPerSeconsary: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

// sync indexes
Product.syncIndexes();

module.exports = Product;
