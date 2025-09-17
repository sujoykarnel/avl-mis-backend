const mongoose = require("mongoose");

const WastageItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    uomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Uom",
      required: true,
    },
    wastageTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WastageType",
      required: true,
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
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
    collection: "wastageItems",
  }
);

const WastageItem = mongoose.model("WastageItem", WastageItemSchema);

// sync indexes
WastageItem.syncIndexes();

module.exports = WastageItem;
