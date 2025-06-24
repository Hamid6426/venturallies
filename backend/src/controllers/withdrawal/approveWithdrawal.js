import Withdrawal from "../../models/Withdrawal.js";
import Balance from "../../models/Balance.js";
import BalanceHistory from "../../models/BalanceHistory.js";

const approveWithdrawal = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { withdrawalId } = req.params;

    const withdrawal = await Withdrawal.findById(withdrawalId).populate("user");

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Withdrawal already processed" });
    }

    const userId = withdrawal.user._id;

    // Check balance
    const userBalance = await Balance.findOne({ user: userId });
    if (!userBalance || userBalance.balance < withdrawal.amount) {
      return res.status(400).json({ message: "Insufficient user balance" });
    }

    const balanceBefore = userBalance.balance;
    const balanceAfter = balanceBefore - withdrawal.amount;

    // Update user balance
    userBalance.balance = balanceAfter;
    await userBalance.save();

    // Create balance history
    await BalanceHistory.create({
      user: userId,
      balanceId: userBalance._id,
      amount: -withdrawal.amount,
      balanceBefore,
      balanceAfter,
      note: `Withdrawal approved by admin`,
      history: [
        {
          action: "withdrawal_approved",
          by: adminId,
          changes: {
            amount: withdrawal.amount,
            withdrawalId: withdrawal._id,
          },
        },
      ],
    });

    // Update withdrawal status
    withdrawal.status = "approved";
    withdrawal.history.push({
      action: "status_changed",
      by: adminId,
      changes: { from: "pending", to: "approved" },
    });

    await withdrawal.save();

    return res.status(200).json({ message: "Withdrawal approved successfully" });
  } catch (err) {
    console.error("approveWithdrawal error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default approveWithdrawal;
