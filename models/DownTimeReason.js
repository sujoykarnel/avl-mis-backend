const mongoose = require("mongoose");
const Counter = require("./Counter");

const ReasonSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    downTimeCategoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DownTimeCategory",
      },
    ],
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
    collection: "downTimeReasons",
    timestamps: true,
  }
);

// helper for sequence
const getNextCode = (seqName, prefix, width) => {
  return Counter.findByIdAndUpdate(
    { _id: seqName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).then((counter) => `${prefix}${String(counter.seq).padStart(width, "0")}`);
};

// pre-save for auto increment code
ReasonSchema.post("save", function (doc, next) {
  if (!doc.code) {
    getNextCode("downTimeReasonCode", "BD", 5)
      .then((code) => {
        doc.code = code;
        return doc.save();
      })
      .then(() => next())
      .catch((err) => next(err));
  } else {
    next();
  }
});

const Reason = mongoose.model("Reason", ReasonSchema);

// sync indexes
Reason.syncIndexes();

module.exports = Reason;
