const mongoose = require("mongoose");

const WastageTypeSchema = new mongoose.Schema(
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
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "wastageTypes",
  }
);

const WastageType = mongoose.model("WastageType", WastageTypeSchema);

// sync indexes
WastageType.syncIndexes();

module.exports = WastageType;
