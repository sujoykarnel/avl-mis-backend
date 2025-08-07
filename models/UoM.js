const mongoose = require("mongoose");

const UomSchema = new mongoose.Schema(
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
    timestamps: true,
  }
);

const Uom = mongoose.model("Uom", UomSchema);

module.exports = Uom;
