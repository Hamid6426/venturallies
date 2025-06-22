import mongoose from "mongoose";
import Balance from "../src/models/Balance.js";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const now = new Date();

const balances = await Balance.find({ $or: [{ createdAt: { $exists: false } }, { updatedAt: { $exists: false } }] });

console.log(`Found ${balances.length} balance records missing timestamps.`);

for (const bal of balances) {
  bal.createdAt = bal.createdAt || now;
  bal.updatedAt = bal.updatedAt || now;
  await bal.save();
}

console.log("Timestamps patched successfully.");
await mongoose.disconnect();
