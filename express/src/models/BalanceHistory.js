// src/models/BalanceHistory.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const balanceHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balanceId: {
      type: Schema.Types.ObjectId,
      ref: "Balance",
      required: true,
    },
    amount: { type: Number, required: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    note: { type: String },
    proofImage: { type: String }, // Moved here — makes sense
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

export default mongoose.model("BalanceHistory", balanceHistorySchema);
