const mongoose = require("mongoose");

const OperationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
  { collection: "lineOperations", timestamps: true }
);

const Operation = mongoose.model("Operation", OperationSchema);

// sync indexes
Operation.syncIndexes();

module.exports = Operation;
