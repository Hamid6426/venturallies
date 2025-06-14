import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  // Total available balance in-app
  balance: { type: Number, default: 0 },

  // Locking mechanism for pending investments
  locked: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export default mongoose.model("Balance", balanceSchema);
