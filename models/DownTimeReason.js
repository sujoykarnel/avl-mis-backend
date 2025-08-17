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
      required: true,
    },
    isElectrical: {
      type: Boolean,
      required: true,
    },
    isMechnical: {
      type: Boolean,
      required: true,
    },
    isOperational: {
      type: Boolean,
      required: true,
    },
    isNoSchedule: {
      type: Boolean,
      required: true,
    },
    isCipSipPp: {
      type: Boolean,
      required: true,
    },
    isMaterial: {
      type: Boolean,
      required: true,
    },
    isScm: {
      type: Boolean,
      required: true,
    },
    isSalesAndMarketing: {
      type: Boolean,
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
  },
  {
    collection: "downTimeReasons",
    timestamps: true,
  }
);

const Reason = mongoose.model("Reason", ReasonSchema);

// sync indexes
Reason.syncIndexes();

module.exports = Reason;
