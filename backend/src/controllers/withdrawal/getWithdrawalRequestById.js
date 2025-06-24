import Withdrawal from "../../models/Withdrawal.js";

const getWithdrawalRequestById = async (req, res) => {
  try {
    const { withdrawalId } = req.params;

    const withdrawal = await Withdrawal.findById(withdrawalId)
      .populate("user", "name email") // Populate user info
      .populate("investment", "amount status") // Populate investment info
      .populate("venture", "title") // Optional: show venture name
      .exec();

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal request not found." });
    }

    return res.status(200).json(withdrawal);
  } catch (err) {
    console.error("Error fetching withdrawal request:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export default getWithdrawalRequestById;
