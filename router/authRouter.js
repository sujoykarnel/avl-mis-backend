const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const { auth } = require("../middlewares/auth");

// sync indexes
User.syncIndexes();

const defaultPassword = "avlmis";
const saltRounds = 10;

// Login User
router.post("/login", async (req, res) => {
  const { enroll, password } = req.body;
  const user = await User.findOne({ enroll })
    .populate("roleId")
    .populate("moduleId")
    .populate("departmentId")
    .populate("designationId")
    .then(async (user) => {
      if (user) {
        const isValidPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (isValidPassword) {
          const { _id, name, enroll, roleId } = user;
          const userData = {
            _id,
            name,
            enroll,
            role: roleId?.name,
          };
          console.log(userData);
          const token = jwt.sign(userData, process.env.JWT_SECRET, {
            expiresIn: "8h",
          });

          const { password, ...userWithoutPassword } = user.toObject();
          res
            .cookie("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite:
                process.env.NODE_ENV === "production" ? "none" : "strict",
            })
            .send(userWithoutPassword);
        } else {
          res.status(401).json({
            error: "Authentication failed!",
          });
        }
      } else {
        res.status(401).json({
          error: "Authentication failed!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Server side error!",
      });
    });
});

// logout user
router.post("/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ success: true });
});

// get profile
router.get("/profile", auth, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId)
    .select("-password")
    .populate("departmentId")
    .populate("designationId")
    .populate("moduleId")
    .populate("roleId")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Section not found." });
    });
});

module.exports = router;
