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
      required: true,
    },
    createdByEnroll: {
      type: Number,
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

module.exports = DownTimeCategory;
