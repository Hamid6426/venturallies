// src/controllers/investment/createInvestment.js
import mongoose from "mongoose";
import Investment from "../../models/Investment.js";
import Venture from "../../models/Venture.js";
import Balance from "../../models/Balance.js";
import BalanceHistory from "../../models/BalanceHistory.js";

const createInvestment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { ventureId, amount } = req.body;
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Load & validate Venture
    const venture = await Venture.findById(ventureId).session(session);
    if (!venture)
      return res.status(404).json({ message: "Venture not found" });

    if (amount < venture.minInvestmentAmount)
      return res.status(400).json({ message: "Amount is below the minimum investment" });

    if (venture.amountFunded + amount > venture.targetAmount)
      return res.status(400).json({ message: "This venture is already fully funded" });

    // 2. Load & validate User Balance
    const balance = await Balance.findOne({ user: userObjectId }).session(session);
    if (!balance || balance.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    const balanceBefore = balance.balance;
    balance.balance -= amount;

    // 3. Create Investment record
    const investment = new Investment({
      venture: venture._id,
      investedBy: userObjectId,
      amount,
      investmentDate: new Date(),
      totalExpectedReturn: amount + (amount * venture.expectedReturn) / 100,
      history: [
        {
          action: "created",
          by: userObjectId,
          at: new Date(),
          changes: {
            investedAmount: amount,
            ventureTitle: venture.title,
          },
        },
      ],
    });

    // 4. Clean Venture history (prevent save error)
    venture.history = (venture.history || []).filter(h => h?.by);
    venture.amountFunded += amount;
    venture.history.push({
      action: "funding_updated",
      by: userObjectId,
      at: new Date(),
      changes: {
        newAmountFunded: venture.amountFunded,
        added: amount,
      },
    });

    // 5. Create BalanceHistory log
    const balanceHistory = new BalanceHistory({
      user: userObjectId,
      balanceId: balance._id,
      amount: -amount,
      balanceBefore,
      balanceAfter: balance.balance,
      note: `Invested €${amount} in "${venture.title}"`,
      history: [
        {
          action: "debited",
          by: userObjectId,
          at: new Date(),
          changes: {
            reason: "Investment",
            ventureTitle: venture.title,
            amount,
          },
        },
      ],
    });

    // 6. Save all models atomically
    await investment.save({ session });
    await balance.save({ session });
    await venture.save({ session });
    await balanceHistory.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(investment);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Investment Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export default createInvestment;
