// src/controllers/investment/getInvestmentsByVenture.js
import Investment from "../../models/Investment.js";

const getInvestmentsByVenture = async (req, res) => {
  try {
    const investments = await Investment.find({
      venture: req.params.ventureId,
    })
      .populate("investedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json(investments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default getInvestmentsByVenture;