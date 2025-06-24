import Withdrawal from "../../models/Withdrawal.js";

const rejectWithdrawal = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { withdrawalId } = req.params;
    const { reason } = req.body;

    const withdrawal = await Withdrawal.findById(withdrawalId);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Withdrawal already processed" });
    }

    // Update withdrawal
    withdrawal.status = "rejected";
    withdrawal.rejectionReason = reason || "Rejected by admin";

    withdrawal.history.push({
      action: "status_changed",
      by: adminId,
      changes: { from: "pending", to: "rejected", reason },
    });

    await withdrawal.save();

    return res.status(200).json({ message: "Withdrawal rejected successfully" });
  } catch (err) {
    console.error("rejectWithdrawal error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default rejectWithdrawal;
