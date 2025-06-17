// src/models/Investment.js
import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const investmentSchema = new Schema(
  {
    venture: {
      type: Types.ObjectId,
      ref: "Venture",
      required: true,
      index: true,
    },

    // Amount invested by the user
    amount: { type: Number, required: true },

    // Date of investment
    investmentDate: { type: Date, default: Date.now },

    // Total profit paid to the investor so far
    profitPaid: { type: Number, default: 0 },

    // True if the original principal amount has been fully returned
    principalReturned: { type: Boolean, default: false },

    // expected return from this investment
    totalExpectedReturn: { type: Number },

    // Investment lifecycle status
    // - "invested" => Active investment (ongoing)
    // - "completed" => Maturity reached (awaiting full repayment)
    // - "repaid" => Profit and principal fully returned
    status: {
      type: String,
      enum: ["invested", "completed", "repaid"],
      default: "invested",
      index: true,
    },

    // Who made or last updated this investment
    investedBy: { type: Types.ObjectId, ref: "User", index: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model("Investment", investmentSchema);
