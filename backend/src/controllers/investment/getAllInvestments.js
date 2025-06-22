// src/controllers/investment/getAllInvestments.js
import mongoose from "mongoose";
import Investment from "../../models/Investment.js";

const getAllInvestments = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const role = req.user?.role;

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: "Invalid admin ID." });
    }

    if (role !== "admin") {
      return res.status(403).json({ message: "Admins only." });
    }
    
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
