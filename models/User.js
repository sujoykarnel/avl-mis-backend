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
      unique: true,
    },
    enroll: {
      type: Number,
      required: true,
      min: 1000,
      max: 999999,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
      match: [/^01[3-9]\d{8}$/, "Please enter a valid mobile number"],
      unique: true,
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
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRole",
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
    isChangedPassword: {
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

const User = mongoose.model("User", UserSchema);

// sync indexes
User.syncIndexes();

module.exports = User;
