// Environment Configuration
import dotenv from "dotenv";
dotenv.config();

// External Packages
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Internal Modules
import logger from "./src/config/logger.js";
import connectDB from "./src/config/mongoose.js";

// Route Handlers
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import ventureRoutes from "./src/routes/ventureRoutes.js";
import investmentRoutes from "./src/routes/investmentRoutes.js";
import balanceRoutes from "./src/routes/balanceRoutes.js";
import kycRoutes from "./src/routes/kycRoutes.js";

import requestLogger from "./src/middleware/requestLogger.js";

// Environment Constants
const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;

// CORS Configuration
const whitelist = [FRONTEND_BASE_URL, BACKEND_BASE_URL].filter(Boolean);
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (NODE_ENV === "development" && whitelist.includes(origin)) {
      return callback(null, true);
    }
    if (NODE_ENV === "production") {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(requestLogger);

// Static File Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve uploaded files (like images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health Check Route
app.get("/health", (req, res) => res.send("Express server is up and running"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ventures", ventureRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/balances", balanceRoutes);
app.use("/api/kyc", kycRoutes);

// Define port
const port = process.env.PORT;

// Start Server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

// Graceful Error Handling
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error);
  process.exit(1);
});

// System Monitoring (RAM Usage)
setInterval(() => {
  const nodeMemory = process.memoryUsage();
  logger.info(`[PROCESS RAM]
    RSS: ${(nodeMemory.rss / 1024 / 1024).toFixed(2)} MB
    Heap Used: ${(nodeMemory.heapUsed / 1024 / 1024).toFixed(2)} MB
    Heap Total: ${(nodeMemory.heapTotal / 1024 / 1024).toFixed(2)} MB
  `);
}, 1000 * 60 * 60);
