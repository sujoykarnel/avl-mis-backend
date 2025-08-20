const mongoose = require("mongoose");

const LineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    lineTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LineType",
      required: true,
    },
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

LineSchema.index({ name: 1, unitId: 1, sectionId: 1 }, { unique: true });

const Line = mongoose.model("Line", LineSchema);

// sync indexes
Line.syncIndexes();

module.exports = Line;
