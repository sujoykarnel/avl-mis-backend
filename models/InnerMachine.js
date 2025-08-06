const mongoose = require("mongoose");

const InnerMachineSchema = new mongoose.Schema(
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
    collection: "innerMachines",
    timestamps: true,
  }
);

const InnerMachine = mongoose.model("InnerMachine", InnerMachineSchema);

module.exports = InnerMachine;
