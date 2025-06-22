// src/controllers/investment/getMyInvestments.js
import Investment from "../../models/Investment.js";

const getMyInvestments = async (req, res) => {
  try {
    const userId = req.user._id;
    const investments = await Investment.find({
      investedBy: userId,
    })
      .populate("venture")
      .sort({ createdAt: -1 });

    return res.status(200).json(investments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default getMyInvestments;