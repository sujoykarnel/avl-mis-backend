const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

const PORT = process.env.PORT || 5000;

// Internal Modules
const unitRouter = require("./router/unitRouter");
const sectionRouter = require("./router/sectionRouter");
const lineRouter = require("./router/lineRouter");
const productRouter = require("./router/productRouter");
const operationRouter = require("./router/operationRouter");
const innerMachineRouter = require("./router/innerMachineRouter");
const downTimeReasonRouter = require("./router/downTimeReasonRouter");
const downTimeCategoryRouter = require("./router/downTimeCategoryRouter");
const lineCapacityRouter = require("./router/lineCapacityRouter");
const uomRouter = require("./router/uomRouter");
const userRouter = require("./router/userRouter");
const lineTypeRouter = require("./router/lineTypeRouter");
const departmentRouter = require("./router/departmentRouter");
const moduleRouter = require("./router/moduleRouter");
const designationRouter = require("./router/designationRouter");
const authRouter = require("./router/authRouter");
const userRoleRouter = require("./router/userRoleRouter");
const lineLogRouter = require("./router/lineLogRouter");
const wastageTypeRouter = require("./router/wastageTypeRouter");
const materialRouter = require("./router/materialRouter");
const wastageItemRouter = require("./router/wastageItemRouter");
const wastageAssignItemRouter = require("./router/wastageAssignItemRouter");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.get("/", (req, res) => {
  res.json({ message: "API Server Running" });
});

// Route setup
app.use("/api/units", unitRouter);
app.use("/api/sections", sectionRouter);
app.use("/api/lines", lineRouter);
app.use("/api/lineTypes", lineTypeRouter);
app.use("/api/products", productRouter);
app.use("/api/lineOperations", operationRouter);
app.use("/api/innerMachines", innerMachineRouter);
app.use("/api/downTimeReasons", downTimeReasonRouter);
app.use("/api/downTimeCategories", downTimeCategoryRouter);
app.use("/api/lineCapacities", lineCapacityRouter);
app.use("/api/uoms", uomRouter);
app.use("/api/users", userRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/designations", designationRouter);
app.use("/api/auth", authRouter);
app.use("/api/userRoles", userRoleRouter);
app.use("/api/lineLogs", lineLogRouter);
app.use("/api/wastageTypes", wastageTypeRouter);
app.use("/api/materials", materialRouter);
app.use("/api/wastageItems", wastageItemRouter);
app.use("/api/wastageAssignItems", wastageAssignItemRouter);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
