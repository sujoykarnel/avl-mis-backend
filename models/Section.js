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
      required: true,
    },
    createdByEnroll: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Section = mongoose.model("Section", SectionSchema);

module.exports = Section;
