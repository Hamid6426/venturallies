// src/models/Balance.js
import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,            // One balance record per user
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,                  // No negative balances
    },
  },
  {
    timestamps: true,          // createdAt, updatedAt for reconciliation
  }
);

export default mongoose.model("Balance", balanceSchema);
