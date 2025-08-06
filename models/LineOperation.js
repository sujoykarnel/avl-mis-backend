const mongoose = require("mongoose");

const LineOperationSchema = new mongoose.Schema(
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

const LineOperation = mongoose.model("LineOperation", LineOperationSchema);

module.exports = LineOperation;
