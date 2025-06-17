import Balance from "../../models/Balance.js";
import mongoose from "mongoose";

const getMyBalance = async (req, res) => {
  const userId = req.user?.id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ error: "Unauthorized or Invalid User ID" });
  }

  try {
    const balanceDoc = await Balance.findOne({ user: userId }).lean();
    if (!balanceDoc) {
      return res.status(404).json({ message: "Balance record not found." });
    }

    res.status(200).json(balanceDoc);
  } catch (err) {
    console.error("getBalanceByUserId error:", err);
    res.status(500).json({ message: "Failed to retrieve balance." });
  }
};

export default getMyBalance;
