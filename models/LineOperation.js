const mongoose = require("mongoose");

const OperationSchema = new mongoose.Schema(
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
  { collection: "lineOperations", timestamps: true }
);

const Operation = mongoose.model("Operation", OperationSchema);

module.exports = Operation;
