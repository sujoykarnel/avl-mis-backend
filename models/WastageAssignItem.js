const mongoose = require("mongoose");

const WastageAssignItemSchema = new mongoose.Schema(
  {
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
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
    wastageItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WastageItem",
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
    collection: "wastageAssignItems",
  }
);

WastageAssignItemSchema.index(
  { unitId: 1, wastageTypeId: 1, materialId: 1, wastageItemId: 1 },
  { unique: true }
);

const WastageAssignItem = mongoose.model(
  "WastageAssignItem",
  WastageAssignItemSchema
);

// sync indexes
WastageAssignItem.syncIndexes();

module.exports = WastageAssignItem;
