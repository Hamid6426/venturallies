import BalanceHistory from "../../models/BalanceHistory.js";
import mongoose from "mongoose";

const getMyBalanceHistory = async (req, res) => {
  const currentUserId = req.user?.id;
  const role = req.user?.role;
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  if (!currentUserId) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  if (currentUserId !== userId && role !== "admin") {
    return res.status(403).json({ message: "Access denied." });
  }

  try {
    const history = await BalanceHistory.find({ user: userId })
      .sort({ changedAt: -1 })
      .populate("changedBy", "firstName email")
      .lean();

    res.status(200).json(history);
  } catch (err) {
    console.error("getBalanceHistory error:", err);
    res.status(500).json({ message: "Failed to fetch balance history." });
  }
};

export default getMyBalanceHistory;
