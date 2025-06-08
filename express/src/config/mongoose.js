import mongoose from "mongoose";
import logger from "./logger.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    logger.error("MONGODB_URI is not defined in .env");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", false); // Optional: to silence strict warnings
    mongoose.set("debug", process.env.NODE_ENV !== "production"); // Show DB queries in dev

    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }

  // Optional: graceful shutdown
  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed on app termination");
    process.exit(0);
  });
};

export default connectDB;
