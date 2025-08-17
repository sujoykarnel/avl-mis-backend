const mongoose = require("mongoose");

const DownTimeCategorySchema = new mongoose.Schema(
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
    collection: "downTimeCategories",
    timestamps: true,
  }
);

const DownTimeCategory = mongoose.model(
  "DownTimeCategory",
  DownTimeCategorySchema
);

// sync indexes
DownTimeCategory.syncIndexes();

module.exports = DownTimeCategory;
