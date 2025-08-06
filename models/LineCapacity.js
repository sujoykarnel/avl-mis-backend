const mongoose = require("mongoose");

const LineCapacitySchema = new mongoose.Schema(
  {
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    lineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Line",
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
    isActive: {
      type: Boolean,
      required: true,
    },
    createdByEnroll: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "lineCapacity",
    timestamps: true,
  }
);

LineCapacitySchema.index(
  { unitId: 1, sectionId: 1, lineId: 1, productId: 1 },
  { unique: true }
);

const LineCapacity = mongoose.model("LineCapacity", LineCapacitySchema);

module.exports = LineCapacity;
