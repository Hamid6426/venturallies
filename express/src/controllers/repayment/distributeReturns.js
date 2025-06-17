// controllers/admin/distributeReturns.js
import Repayment from "../../models/Repayment.js";
import Investment from "../../models/Investment.js";
import Balance from "../../models/Balance.js";
import BalanceHistory from "../../models/BalanceHistory.js";

const distributeReturns = async (req, res) => {
  try {
    const { distributions } = req.body; // Array of { investmentId, amount, type, note }

    if (!Array.isArray(distributions) || distributions.length === 0) {
      return res.status(400).json({ message: "Invalid or empty distributions" });
    }

    for (const item of distributions) {
      const { investmentId, amount, type, note } = item;

      if (!["profit", "principal"].includes(type)) {
        continue;
      }

      const investment = await Investment.findById(investmentId).populate("venture user");
      if (!investment) continue;

      const userId = investment.investedBy;
      const userBalance = await Balance.findOne({ user: userId });

      if (!userBalance) continue;

      const before = userBalance.balance;
      userBalance.balance += amount;
      await userBalance.save();

      // Add BalanceHistory
      await BalanceHistory.create({
        user: userId,
        balanceId: userBalance._id,
        amount,
        balanceBefore: before,
        balanceAfter: userBalance.balance,
        note: note || `${type} return for investment in ${investment.venture.title}`,
        changedBy: req.user._id,
      });

      // Add Repayment entry
      await Repayment.create({
        investment: investment._id,
        user: userId,
        amount,
        type,
        status: "paid",
        note,
        createdBy: req.user._id,
        approvedBy: req.user._id,
        approvedAt: new Date(),
      });

      // Update investment
      if (type === "profit") {
        investment.profitPaid += amount;
      } else if (type === "principal") {
        investment.principalReturned = true;
      }
      await investment.save();
    }

    return res.status(200).json({ message: "Returns distributed successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default distributeReturns;
