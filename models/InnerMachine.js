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
      default: true,
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    collection: "innerMachines",
    timestamps: true,
  }
);

const InnerMachine = mongoose.model("InnerMachine", InnerMachineSchema);

// sync indexes
InnerMachine.syncIndexes();

module.exports = InnerMachine;
