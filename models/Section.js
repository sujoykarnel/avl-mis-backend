const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema(
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

const Section = mongoose.model("Section", SectionSchema);

// sync indexes
Section.syncIndexes();

module.exports = Section;
