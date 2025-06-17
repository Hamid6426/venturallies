// src/controllers/investment/getInvestmentsByVenture.js
import Investment from "../../models/Investment.js";

// GET /api/investments/:id
const getMyInvestmentById = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id).populate(
      "venture"
    );

    if (
      !investment ||
      investment.investedBy.toString() !== req.user._id.toString()
    )
      return res.status(403).json({ message: "Access denied" });

    return res.status(200).json(investment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default getMyInvestmentById;
