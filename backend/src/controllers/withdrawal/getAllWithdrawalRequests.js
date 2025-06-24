import Withdrawal from "../../models/Withdrawal.js";
import User from "../../models/User.js";

const getAllWithdrawalRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status; // e.g. pending, approved, rejected
    }

    const withdrawals = await Withdrawal.find(filter)
      .populate("user", "name email") // Get user's name/email for admin display
      .sort({ createdAt: -1 });

    return res.status(200).json(withdrawals);
  } catch (err) {
    console.error("getAllWithdrawalRequests error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getAllWithdrawalRequests;
