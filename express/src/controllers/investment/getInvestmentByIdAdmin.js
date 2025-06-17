// src/controllers/investment/getInvestmentByIdForAdmin.js
import Investment from "../../models/Investment.js";

const getInvestmentByIdForAdmin = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id)
      .populate("investedBy", "firstName lastName email")
      .populate("venture", "title slug status");

    if (!investment)
      return res.status(404).json({ message: "Investment not found" });

    return res.status(200).json(investment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default getInvestmentByIdForAdmin;
