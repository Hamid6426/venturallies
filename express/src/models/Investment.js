import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    venture: { type: mongoose.Schema.Types.ObjectId, ref: "Venture", required: true },

    amount: { type: Number, required: true },
    returnExpected: { type: Number }, // Optional - you can pre-calculate % based on venture

    status: {
      type: String,
      enum: ["active", "cancelled", "refunded", "completed"],
      default: "active",
    },

    investedAt: { type: Date, default: Date.now },
    refundedAt: { type: Date },

    note: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Investment", investmentSchema);
