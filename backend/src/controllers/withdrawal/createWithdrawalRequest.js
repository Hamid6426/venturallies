import Withdrawal from "../../models/Withdrawal.js";

const createWithdrawalRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, note } = req.body;
    const proofImage = req.file?.path || null;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal amount" });
    }

    const withdrawal = new Withdrawal({
      user: userId,
      amount,
      proofImage,
      note,
      history: [
        {
          action: "created",
          by: userId,
          changes: { amount, note },
        },
      ],
    });

    await withdrawal.save();

    return res.status(201).json({ message: "Withdrawal request submitted", withdrawal });
  } catch (err) {
    console.error("createWithdrawalRequest error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default createWithdrawalRequest;
