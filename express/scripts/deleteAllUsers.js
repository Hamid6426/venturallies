import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

async function deleteAllUsers() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    const result = await User.deleteMany({});
    console.log(`Deleted ${result.deletedCount} users.`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error deleting users:", error);
    process.exit(1);
  }
}

deleteAllUsers();
