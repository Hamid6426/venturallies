import Balance from "../../models/Balance.js";
import mongoose from "mongoose";

const getBalanceByUserId = async (req, res) => {
  const adminId = req.user?.id;
  const userRole = req.user?.role;

  if (!adminId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ error: "Unauthorized or Invalid User ID" });
  }

  if (userRole !== "admin") {
    return res.status(403).json({ message: "Admins only." });
  }

  const { userId } = req.params;

  try {
    const balance = await Balance.findOne({ user: userId }).lean();
    if (!balance) {
      return res.status(404).json({ message: "Balance record not found." });
    }

    res.status(200).json(balance);
  } catch (err) {
    console.error("getBalanceByUserId error:", err);
    res.status(500).json({ message: "Failed to retrieve balance." });
  }
};

export default getBalanceByUserId;
