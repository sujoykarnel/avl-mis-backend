const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// sync indexes
User.syncIndexes();

// Get all users
router.get("/", async (req, res) => {
  const search = req.query.search || "";
  const users = await User.find({
    name: { $regex: search, $options: "i" },
  })
    .populate("departmentId")
    .populate("designationId")
    .populate("moduleId")
    .populate("createdById")
    .limit()
    .then((users) => {
      // console.log(sections);
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Section not found." });
    });
});

// Get one user
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Create user
router.post("/", async (req, res) => {
  
  const hashedPassword = await bcrypt.hash('avlmis', 10);
  console.log(hashedPassword);
  const user = new User({ ...req.body, password: hashedPassword });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

// Update user
router.put("/:id", async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete user
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
