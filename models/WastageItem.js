const mongoose = require("mongoose");

const WastageItemSchema = new mongoose.Schema(
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
  {
    timestamps: true,
    collection: "wastageItems",
  }
);

const WastageItem = mongoose.model("WastageItem", WastageItemSchema);

// sync indexes
WastageItem.syncIndexes();

module.exports = WastageItem;
