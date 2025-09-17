const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { auth } = require("../middlewares/auth");

// sync indexes
User.syncIndexes();

const defaultPassword = "mis";
const saltRounds = 10;

console.log("hit");

// Get all users
router.get("/", auth, async (req, res) => {
  const search = req.query.search || "";
  const page = parseInt(req.query.currentPage);
  const size = parseInt(req.query.rowPerPage);

  await User.find({
    name: { $regex: search, $options: "i" },
  })
    .populate("departmentId")
    .populate("designationId")
    .populate("moduleId")
    .populate("roleId")
    .populate("createdById")
    .skip(page * size)
    .limit(size)
    .then((data) => {
      User.countDocuments({ name: { $regex: search, $options: "i" } })
        .then((count) => {
          res.status(200).json({ data, totalCount: count });
        })
        .catch((countErr) => {
          console.error(countErr);
          res.status(500).json({ error: "Failed to count Users." });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Users not found." });
    });
});



// Get one user
router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("departmentId")
    .populate("designationId")
    .populate("moduleId")
    .populate("roleId")
    .then((user) => {
      // console.log(sections);
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Section not found." });
    });
});

// Create user
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
  const newItem = { ...req.body, password: hashedPassword, createdById };
  const user = new User(newItem);
  const savedUser = await user
    .save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err.code);
      if (err.code === 11000) {
        res.status(409).json({ err, error: "Duplicate" });
      }
      res.status(404).json({
        err,
        error: "Item not found.",
      });
    });
});

// Update user
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  let updatedData = { ...req.body, updatedById };
  if (req.body?.password) {
    if (req.body.password === "reset") {
      // Reset to default password
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
      updatedData.password = hashedPassword;
      updatedData.isChangedPassword = false;
    } else {
      // Update to provided new password

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const comparePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log(comparePassword);
      if (comparePassword) {
        const hashedPassword = await bcrypt.hash(
          req.body.newPassword,
          saltRounds
        );
        updatedData.password = hashedPassword;
        updatedData.isChangedPassword = true;
      } else {
        console.log("pass not match");
        return res.status(404).json({
          error: "Current password is incorrect.",
        });
      }
    }
  }

  const updated = await User.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
  })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err.code);
      if (err.code === 11000) {
        res.status(409).json({ err, error: "Duplicate" });
      }
      res.status(404).json({
        err,
        error: "Item not found.",
      });
    });
});

// Update user password
router.patch("/:id/updatePassword", async (req, res) => {
  const updatedById = req.userId;
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const comparePassword = await bcrypt.compare(currentPassword, user.password);

  if (comparePassword) {
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log("Yes");
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedNewPassword, updatedById, isChangedPassword: true },
      {
        new: true,
      }
    )
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((err) => {
        console.log(err.code);
        res.status(404).json({
          err,
          error: "Current password is incorrect.",
        });
      });
  } else {
    console.log("No");
    res.status(404).json({
      error: "Current password is incorrect.",
    });
  }
});

// Delete user
router.delete("/:id", auth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
