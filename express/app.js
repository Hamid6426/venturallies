import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import logger from "./config/logger.js";
import connectDB from "./config/mongoose.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
const whitelist = [FRONTEND_BASE_URL, BACKEND_BASE_URL].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const app = express();
app.use(express.json());

app.use(cors(corsOptions));
app.use(cookieParser()); 

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Express server is up and running");
});

export default app;
