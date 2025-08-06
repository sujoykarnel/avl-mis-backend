const mongoose = require("mongoose");

const LineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
    timestamps: true,
  }
);

const Line = mongoose.model("Line", LineSchema);

module.exports = Line;
