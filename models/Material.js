const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    uomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Uom",
      required: true,
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
    collection: "materials",
  }
);

MaterialSchema.index({ name: 1, uomId: 1 }, { unique: true });

const Material = mongoose.model("Material", MaterialSchema);

// sync indexes
Material.syncIndexes();

module.exports = Material;
