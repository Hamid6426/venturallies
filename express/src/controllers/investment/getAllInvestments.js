// src/controllers/investment/getAllInvestments.js
import Investment from "../../models/Investment.js";

const getAllInvestments = async (req, res) => {
  try {
    const investments = await Investment.find()
      .populate("investedBy", "firstName lastName email")
      .populate("venture", "title slug status")
      .sort({ createdAt: -1 });

    return res.status(200).json(investments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default getAllInvestments;
