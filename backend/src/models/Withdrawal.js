import mongoose from "mongoose";
import HistorySubSchema from "./HistorySubSchema.js";

const withdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    proofImage: {
      type: String, // Optional — screenshot or file path
    },
    additionalNote: {
      type: String, // Optional — extra explanation
    },
    source: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    rejectionReason: { type: String, default: null },

    accountHolderName: { type: String, required: true },
    bankName: { type: String, required: true },
    iban: { type: String, required: true },

    // Optional: associate with which balance record snapshot
    balanceSnapshot: {
      type: Number,
      default: null,
    },

    history: [HistorySubSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Withdrawal", withdrawalSchema);
