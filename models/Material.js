const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema(
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
    collection: "materials",
  }
);

const Material = mongoose.model(
  "Material",
  MaterialSchema
);

// sync indexes
Material.syncIndexes();

module.exports = Material;
