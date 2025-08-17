const mongoose = require("mongoose");

const LineTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    collection: "lineTypes",
    timestamps: true,
  }
);

const LineType = mongoose.model("LineType", LineTypeSchema);

// sync indexes
LineType.syncIndexes();

module.exports = LineType;
