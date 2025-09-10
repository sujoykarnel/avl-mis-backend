const mongoose = require("mongoose");

const LineCapacitySchema = new mongoose.Schema(
  {
    lineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    capacityPerHr: {
      type: Number,
      required: true,
    },
    manpowerPerHr: {
      type: Number,
      default: null,
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
    collection: "lineCapacities",
    timestamps: true,
  }
);

LineCapacitySchema.index(
  { unitId: 1, lineId: 1, productId: 1 },
  { unique: true }
);

const LineCapacity = mongoose.model("LineCapacity", LineCapacitySchema);

// sync indexes
LineCapacity.syncIndexes();

module.exports = LineCapacity;
