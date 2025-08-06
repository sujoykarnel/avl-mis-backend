const mongoose = require("mongoose");

const LineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      require: true,
    },
    createdByEnroll: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Line = mongoose.model("Line", LineSchema);

module.exports = Line;
