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
      default: true,
    },
    createdById: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
  },
  {
    timestamps: true,
  }
);

const Uom = mongoose.model("Uom", UomSchema);

module.exports = Uom;
