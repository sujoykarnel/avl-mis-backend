const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;

// Internal Modules
const lineRouter = require("./router/lineRouter");
const productRouter = require("./router/productRouter");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Route setup
app.use("/api/lines", lineRouter);
app.use("/api/products", productRouter);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
