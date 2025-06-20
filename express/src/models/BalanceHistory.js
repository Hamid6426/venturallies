// src/models/BalanceHistory.js
import mongoose from "mongoose";
import HistorySubSchema from "./HistorySubSchema.js";

const { Schema } = mongoose;

const balanceHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Whose balance changed
    },
    balanceId: {
      type: Schema.Types.ObjectId,
      ref: "Balance",
      required: true, // Which balance record
    },
    amount: { type: Number, required: true }, // Delta amount
    balanceBefore: { type: Number, required: true }, // Snap before change
    balanceAfter: { type: Number, required: true }, // Snap after change
    note: { type: String }, // Optional memo
    proofImage: { type: String }, // e.g. receipt URL

    // ─── Change History ───────────────────────────────────────────────────
    history: [HistorySubSchema], // Detailed audit for manual overrides
  },
  {
    timestamps: false, // We use `history` instead of createdAt/changedAt
  }
);

export default mongoose.model("BalanceHistory", balanceHistorySchema);
