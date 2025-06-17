// src/controllers/investment/createInvestment.js
import Investment from "../../models/Investment.js";
import Venture from "../../models/Venture.js";
import Balance from "../../models/Balance.js";
import BalanceHistory from "../../models/BalanceHistory.js";

const createInvestment = async (req, res) => {
  try {
    const { ventureId, amount } = req.body;
    const userId = req.user._id;

    const venture = await Venture.findById(ventureId);
    if (!venture) return res.status(404).json({ message: "Venture not found" });

    if (amount < venture.minInvestmentAmount)
      return res
        .status(400)
        .json({ message: "Amount is below the minimum investment" });

    if (venture.amountFunded + amount > venture.targetAmount)
      return res
        .status(400)
        .json({ message: "This venture is already fully funded" });

    const balance = await Balance.findOne({ user: userId });
    if (!balance || balance.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    // Deduct from user balance
    const balanceBefore = balance.balance;
    balance.balance -= amount;
    await balance.save();

    // Create Investment
    const investment = await Investment.create({
      venture: ventureId,
      amount,
      investmentDate: new Date(),
      totalExpectedReturn: amount + (amount * venture.expectedReturn) / 100,
      investedBy: userId,
    });

    // Update Venture amountFunded
    venture.amountFunded += amount;
    await venture.save();

    // Log Balance History
    await BalanceHistory.create({
      user: userId,
      balanceId: balance._id,
      amount: -amount,
      balanceBefore,
      balanceAfter: balance.balance,
      note: `Invested in ${venture.title}`,
      changedBy: userId,
    });

    return res.status(201).json(investment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default createInvestment;
