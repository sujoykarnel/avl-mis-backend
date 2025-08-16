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
      default: true,
    },
    createdById: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
  },
  { collection: "lineOperations", timestamps: true }
);

const Operation = mongoose.model("Operation", OperationSchema);

module.exports = Operation;
