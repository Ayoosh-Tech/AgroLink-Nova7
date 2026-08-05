require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const sequelize = require("./config/db");
require("./models/index"); // registers associations

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(helmet());
//app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://agrolink-nova7.netlify.app/",
    "https://agro-link-nova7.vercel.app/"
  ],
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("[agrolink] Connected to PostgreSQL.");
    app.listen(PORT, () => console.log(`[agrolink] API listening on port ${PORT}`));
  } catch (err) {
    console.error("[agrolink] Failed to start:", err);
    process.exit(1);
  }
}

start();

module.exports = app;
