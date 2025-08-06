const mongoose = require("mongoose");

const ReasonSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      requiredd: true,
      unique: true,
    },
    name: {
      type: String,
      requiredd: true,
      unique: true,
    },
    isPower: {
      type: Boolean,
      requiredd: true,
    },
    isElectrical: {
      type: Boolean,
      requiredd: true,
    },
    isMechnical: {
      type: Boolean,
      requiredd: true,
    },
    isOperational: {
      type: Boolean,
      requiredd: true,
    },
    isNoSchedule: {
      type: Boolean,
      requiredd: true,
    },
    isCipSipPp: {
      type: Boolean,
      requiredd: true,
    },
    isMaterial: {
      type: Boolean,
      requiredd: true,
    },
    isScm: {
      type: Boolean,
      requiredd: true,
    },
    isSalesAndMarketing: {
      type: Boolean,
      requiredd: true,
    },
    isActive: {
      type: Boolean,
      requiredd: true,
    },
    createdByEnroll: {
      type: Number,
      requiredd: true,
    },
  },
  {
    collection: "downTimeReasons",
    timestamps: true,
  }
);

const Reason = mongoose.model("Reason", ReasonSchema);

module.exports = Reason;
