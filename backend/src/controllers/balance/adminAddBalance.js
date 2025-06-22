import Balance from "../../models/Balance.js";
import BalanceHistory from "../../models/BalanceHistory.js";
import mongoose from "mongoose";

const adminAddBalance = async (req, res) => {
  const adminId = req.user?.id;
  const role = req.user?.role;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: "Invalid admin ID." });
  }

  if (role !== "admin") {
    return res.status(403).json({ message: "Admins only." });
  }

  const { note } = req.body;
  const { userId } = req.params;

  const parsedAmount = parseFloat(req.body.amount);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  if (isNaN(parsedAmount) || parsedAmount === 0) {
    return res.status(400).json({ message: "Amount must be a non-zero number." });
  }

  try {
    const balanceDoc = await Balance.findOne({ user: userId });
    if (!balanceDoc) {
      return res.status(404).json({ message: "Balance record not found." });
    }

    const oldBalance = balanceDoc.balance;
    const newBalance = oldBalance + parsedAmount;

    if (newBalance < 0) {
      return res.status(400).json({ message: "Balance cannot go negative." });
    }

    // Optional proof image
    let proofImagePath = null;

    if (req.processedFiles?.length) {
      if (req.processedFiles.length > 1) {
        return res.status(400).json({ message: "Only 1 image is allowed." });
      }

      const file = req.processedFiles[0];
      const fullPath = `/uploads/balance_proofs/${file.filename}`;

      if (!fullPath.startsWith("/uploads/balance_proofs/")) {
        return res.status(400).json({ message: "Invalid image path detected." });
      }

      proofImagePath = fullPath;
    }

    // Update user balance
    balanceDoc.balance = newBalance;
    await balanceDoc.save();

    // Add balance history entry
    await BalanceHistory.create({
      user: userId,
      balanceId: balanceDoc._id,
      amount: parsedAmount,
      balanceBefore: oldBalance,
      balanceAfter: newBalance,
      note: note || "Manual balance adjustment by admin.",
      proofImage: proofImagePath,
      history: [
        {
          action: "admin_balance_update",
          by: adminId,
          changes: {
            amount: parsedAmount,
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

export default adminAddBalance;
