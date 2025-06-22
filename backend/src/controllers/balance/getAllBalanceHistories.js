import BalanceHistory from "../../models/BalanceHistory.js";
import mongoose from "mongoose";

const getAllBalanceHistories = async (req, res) => {
  const adminId = req.user?.id;
  const userRole = req.user?.role;

  if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(401).json({ error: "Unauthorized or Invalid Admin ID" });
  }

  if (userRole !== "admin") {
    return res.status(403).json({ message: "Admins only." });
  }

  try {
    const histories = await BalanceHistory.find({})
      .populate("user", "firstName lastName email role")
      .populate("balanceId", "_id") // optional, could be used for linking
      .sort({ _id: -1 }) // recent first
      .lean();

    res.status(200).json(histories);
  } catch (err) {
    console.error("getAllBalanceHistories error:", err);
    res.status(500).json({ message: "Failed to fetch balance histories." });
  }
};

export default getAllBalanceHistories;
