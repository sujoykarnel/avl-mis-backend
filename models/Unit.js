const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      require: true,
    },
    createdByEnroll: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Unit = mongoose.model("Unit", UnitSchema);

module.exports = Unit;
