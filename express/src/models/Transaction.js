import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Amount of the transaction (positive or negative)
    amount: { type: Number, required: true },

    // Type of transaction
    type: {
      type: String,
      enum: ["top-up", "investment", "refund", "adjustment"],
      required: true,
    },

    // Optional references
    investment: { type: mongoose.Schema.Types.ObjectId, ref: "Investment" },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin who credited

    // Notes for audit or manual changes
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transactionSchema);
