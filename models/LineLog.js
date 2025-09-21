const mongoose = require("mongoose");

//  nasted wastage qty schima
const wastageQtySchema = new mongoose.Schema(
  {
    wastageItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WastageItem",
      required: true,
    },

    wasteQty: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

//  nasted wastage qty schima
const wastageSchema = new mongoose.Schema(
  {
    wastageTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WastageType",
      required: true,
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WastageItem",
      required: true,
    },
    usedQty: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    waste: [wastageQtySchema],
  },
  { _id: false }
);

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
    initCounter: {
      type: Number,
      required: true,
    },
    endCounter: {
      type: Number,
      required: true,
    },
    operationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LineOperation",
      required: true,
    },
    downtimeCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DownTimeCategory",
      default: null,
    },
    downtimeReasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DownTimeReason",
      default: null,
    },
    innerMachineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InnerMachine",
      default: null,
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
      default: "",
      trim: true,
    },
    wastage: [wastageSchema],
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
      default: null,
    },
  },
  {
    collection: "lineLogs",
    timestamps: true,
  }
);

LineLogSchema.index({ capacityId: 1, fromDateTime: 1 }, { unique: true });

const LineLog = mongoose.model("LineLog", LineLogSchema);

// sync indexes
LineLog.syncIndexes();

module.exports = LineLog;
