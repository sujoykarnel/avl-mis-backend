const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const { auth } = require("../middlewares/auth");

// text helper
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all departments
router.get("/", auth, async (req, res) => {
  const userRole = req.userRole;
  const search = req.query.search || "";
  const safeSearch = escapeRegex(search);
  const page = parseInt(req.query.currentPage);
  const size = parseInt(req.query.rowPerPage);

  await Department.find({
    ...(userRole === "User" ? { isActive: true } : {}),
    name: { $regex: safeSearch, $options: "i" },
  })
    .populate("createdById")
    .skip(page * size)
    .limit(size)
    .then((data) => {
      Department.countDocuments({
        ...(userRole === "User" ? { isActive: true } : {}),
        name: { $regex: safeSearch, $options: "i" },
      })
        .then((count) => {
          res.status(200).json({ data, totalCount: count });
        })
        .catch((countErr) => {
          console.error(countErr);
          res.status(500).json({ error: "Failed to count Departments." });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Departments not found." });
    });
});

// Get one department
router.get("/:id", auth, async (req, res) => {
  await Department.findById(req.params.id)
    .populate()
    .populate("createdById")
    .limit()
    .then((department) => {
      // console.log(department);
      res.status(200).json(department);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, error: "Department not found." });
    });
});

// Create department
router.post("/", auth, async (req, res) => {
  const createdById = req.userId;
  const newItem = { ...req.body, createdById };
  const department = new Department(newItem);
  const savedDepartment = await department
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

// Update department
router.patch("/:id", auth, async (req, res) => {
  const updatedById = req.userId;
  const updatedData = { ...req.body, updatedById };
  const updated = await Department.findByIdAndUpdate(
    req.params.id,
    updatedData,
    {
      new: true,
    }
  )
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

// Delete department
router.delete("/:id", auth, async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
