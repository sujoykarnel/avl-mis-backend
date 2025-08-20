const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    frNo: {
      type: String,
      required: true,
    },
    enroll: {
      type: Number,
      required: true,
      min: 100000,
      max: 999999,
    },
    password: {
      type: String,
      required: true,
      default: "avlmis",
    },
    mobileNo: {
      type: String,
      required: true,
      match: [/^01[3-9]\d{8}$/, "Please enter a valid mobile number"],
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      required: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    lineIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Line",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isChangePassword: {
      type: Boolean,
      default: false,
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
    timestamps: true,
  }
);

UserSchema.index({ frNo: 1, enroll: 1, mobileNo: 1 }, { unique: true });

const User = mongoose.model("User", UserSchema);

// sync indexes
User.syncIndexes();

module.exports = User;
