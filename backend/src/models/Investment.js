// src/models/Investment.js
import mongoose from "mongoose";
import HistorySubSchema from "./HistorySubSchema.js";

const investmentSchema = new mongoose.Schema(
  {
    venture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venture",
      required: true, // Which venture was invested in
    },
    investedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Who made the investment
    },

    amount: { type: Number, required: true }, // Principal
    investmentDate: { type: Date, default: Date.now }, // Timestamp
    profitPaid: { type: Number, default: 0 }, // Profit returned so far
    principalReturned: { type: Boolean, default: false }, // Principal fully returned?
    totalExpectedReturn: { type: Number }, // Sum principal+profit

    status: {
      type: String,
      enum: ["invested", "completed", "repaid"],
      default: "invested",
      index: true, // Enables fast filtering by stage
    },

    // ─── Change History ─────────────────────────────────────────────────────
    history: [HistorySubSchema], // Record state changes & notes over time
  },
  { timestamps: true } // createdAt, updatedAt
);

export default mongoose.model("Investment", investmentSchema);
