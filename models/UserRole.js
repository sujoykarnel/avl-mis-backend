const mongoose = require("mongoose");

const UserRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
  { collection: "userRoles", timestamps: true }
);

const UserRole = mongoose.model("UserRole", UserRoleSchema);

// sync indexes
UserRole.syncIndexes();

module.exports = UserRole;
