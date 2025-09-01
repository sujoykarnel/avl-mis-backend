const express = require("express");
const router = express.Router();
const UserRole = require("../models/UserRole");
const { auth } = require("../middlewares/auth");

// Get all userRoles
router.get("/", auth, async (req, res) => {
  const search = req.query.search || "";
  const userRoles = await UserRole.find({
    name: { $regex: search, $options: "i" },
  })
    .populate()
    .limit()
    .then((userRoles) => {
      // console.log(userRoles);
      res.status(200).json(userRoles);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Item not found." });
    });
});

// Get one userRole
router.get("/:id", auth, async (req, res) => {
  console.log(req.params.id);
  await UserRole.findById(req.params.id)
    .populate()
    .then((userRole) => {
      console.log(userRole);
      res.status(200).json(userRole);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Item not found." });
    });
});

// Create userRole
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const userRole = new UserRole(newItem);
  const savedUserRole = await userRole
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

// Update userRole
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await UserRole.findByIdAndUpdate(req.params.id, updatedData, {
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

// Delete userRole
router.delete("/:id", auth, async (req, res) => {
  await UserRole.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
