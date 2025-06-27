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
    // Allow curl, mobile apps, etc.
    if (!origin) return callback(null, true);

    // In development, only allow whitelisted origins
    if (NODE_ENV === "development" && whitelist.includes(origin)) {
      return callback(null, true);
    }

    // In production, typically frontend is served from same origin
    if (NODE_ENV === "production") {
      return callback(null, true);
    }

    // Otherwise, block the request
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // Allows cookies, credentials, etc.
};

// Initialize Express App
const app = express();

// Configure port - this works on Render because they automatically set PORT environment variable
const port = process.env.PORT || 4000;

// Connect to Database
connectDB();

// Global Middlewares
app.use(express.json());
app.use(cors(corsOptions)); // Enable CORS with custom options
app.use(cookieParser()); // Parse cookies from incoming requests

// Logging Configuration
app.use(requestLogger);

// This is needed for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// System Monitoring
setInterval(() => {
  const nodeMemory = process.memoryUsage();
  logger.info(`[PROCESS RAM]
    RSS: ${(nodeMemory.rss / 1024 / 1024).toFixed(2)} MB
    Heap Used: ${(nodeMemory.heapUsed / 1024 / 1024).toFixed(2)} MB
    Heap Total: ${(nodeMemory.heapTotal / 1024 / 1024).toFixed(2)} MB
  `);
}, 1000 * 60 * 60); // Run every hour

// Health Check Route (Keep this before API routes for quick monitoring)
app.get("/health", (req, res) => res.send("Express server is up and running"));

// Production Frontend Serving
app.get("/*splat", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return next();
  }

  const indexPath = path.join(__dirname, "dist", "index.html");
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send("index.html not found in dist");
  }
  res.sendFile(indexPath);
});

// API Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/users", userRoutes); // User management routes
app.use("/api/profile", profileRoutes); // Profile management routes
app.use("/api/ventures", ventureRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/balances", balanceRoutes);
app.use("/api/kyc", kycRoutes);

// Start listening BEFORE any other operations
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Error Handling for Uncaught Exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error);
  process.exit(1);
});
