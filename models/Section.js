const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema(
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

const Section = mongoose.model("Section", SectionSchema);

module.exports = Section;
