const mongoose = require("mongoose");

const LineLogSchema = new mongoose.Schema(
  {
    capacityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LineCapacity",
      required: true,
    },
    batchNo: {
      type: String,
      required: true,
    },
    fromDateTime: {
      type: Date,
      required: true,
    },
    toDateTime: {
      type: Date,
      required: true,
    },
    endCounter: {
      type: Number,
      required: true,
    },
    initCounter: {
      type: Number,
      required: true,
    },
    downtimeCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DownTimeCategory",
    },
    downtimeReasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DownTimeReason",
    },
    innerMachineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InnerMachine",
    },
    operationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LineOperation",
      required: true,
    },
    productionQty: {
      type: Number,
      required: true,
    },
    manpower: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
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
    collection: "lineLogs",
    timestamps: true,
  }
);

LineLogSchema.index(
  { capacityId: 1, fromDateTime: 1, toDateTime: 1 },
  { unique: true }
);

const LineLog = mongoose.model("LineLog", LineLogSchema);

// sync indexes
LineLog.syncIndexes();

module.exports = LineLog;
