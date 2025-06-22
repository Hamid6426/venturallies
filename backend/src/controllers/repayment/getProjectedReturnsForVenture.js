// controllers/repayment/getProjectedReturnsForVenture.js
import Investment from "../../models/Investment.js";
import Venture from "../../models/Venture.js";

const getProjectedReturnsForVenture = async (req, res) => {
  try {
    const { ventureId } = req.params;

    const venture = await Venture.findById(ventureId);
    if (!venture) return res.status(404).json({ message: "Venture not found" });

    const investments = await Investment.find({ venture: ventureId });

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const projectedReturn = (totalInvested * venture.expectedReturn) / 100;

    return res.status(200).json({
      ventureId,
      ventureTitle: venture.title,
      totalInvested,
      expectedReturnPercent: venture.expectedReturn,
      projectedReturn,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default getProjectedReturnsForVenture;
