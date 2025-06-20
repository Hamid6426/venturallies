import Balance from "../../models/Balance.js";
import BalanceHistory from "../../models/BalanceHistory.js";
import mongoose from "mongoose";

const AdminAddBalance = async (req, res) => {
  const adminId = req.user?.id;
  const role = req.user?.role;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: "Invalid admin ID." });
  }

  if (role !== "admin") {
    return res.status(403).json({ message: "Admins only." });
  }

  const { amount, note, proofImage } = req.body;
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  if (typeof amount !== "number" || amount === 0) {
    return res.status(400).json({ message: "Amount must be a non-zero number." });
  }

  try {
    const balanceDoc = await Balance.findOne({ user: userId });
    if (!balanceDoc) {
      return res.status(404).json({ message: "Balance record not found." });
    }

    const oldBalance = balanceDoc.balance;
    const newBalance = oldBalance + amount;

    if (newBalance < 0) {
      return res.status(400).json({ message: "Balance cannot go negative." });
    }

    balanceDoc.balance = newBalance;
    await balanceDoc.save();

    await BalanceHistory.create({
      user: userId,
      balanceId: balanceDoc._id,
      amount,
      balanceBefore: oldBalance,
      balanceAfter: newBalance,
      note: note || "Manual balance adjustment by admin.",
      proofImage,
      history: [
        {
          action: "admin_balance_update", // or "manual_topup"
          by: adminId,
          changes: {
            amount,
            balanceBefore: oldBalance,
            balanceAfter: newBalance,
            reason: note,
          },
        },
      ],
    });

    res.status(200).json({
      message: "Balance manually updated by admin.",
      balance: balanceDoc,
    });
  } catch (err) {
    console.error("AdminAddBalance error:", err);
    res.status(500).json({ message: "Failed to update balance." });
  }
};

export default AdminAddBalance;
