// dotenv before everything
import dotenv from "dotenv";
dotenv.config();

// External packages
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import osu from "node-os-utils";

// Internal modules
import logger from "./src/config/logger.js";
import connectDB from "./src/config/mongoose.js";

// Route handlers
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";

// Constants
const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;

// Whitelist for CORS (filter removes undefined/null values)
const whitelist = [FRONTEND_BASE_URL, BACKEND_BASE_URL].filter(Boolean);

// CORS options
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

// Initialize App and Connect DB
const app = express();

await connectDB();

// Global Middlewares
app.use(express.json()); // Parse incoming JSON
app.use(cors(corsOptions)); // Enable CORS with custom options
app.use(cookieParser()); // Parse cookies from incoming requests

// HTTP request logger using custom logger stream
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

setInterval(() => {
  const nodeMemory = process.memoryUsage();
  console.log(`[PROCESS RAM]
  RSS: ${(nodeMemory.rss / 1024 / 1024).toFixed(2)} MB
  Heap Used: ${(nodeMemory.heapUsed / 1024 / 1024).toFixed(2)} MB
  Heap Total: ${(nodeMemory.heapTotal / 1024 / 1024).toFixed(2)} MB
  `);
}, 1000 * 60 * 60);

// API Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/profile", profileRoutes); // Profile management routes
app.use("/api/users", userRoutes); // User management routes

// Serve Frontend in Production
if (NODE_ENV === "production") {
  const reactDistPath = path.join(process.cwd(), "dist");
  app.use(express.static(reactDistPath));

  app.get("*", (req, res) =>
    res.sendFile(path.join(reactDistPath, "index.html"))
  );
}

// Health Check Route
app.get("/", (req, res) => res.send("Express server is up and running"));

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
