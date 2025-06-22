import mongoose from "mongoose";
import Venture from "../../models/Venture.js";

const getVentureById = async (req, res) => {
  try {
    const { ventureId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ventureId)) {
      return res.status(400).json({ message: "Invalid Venture ID." });
    }

    const venture = await Venture.findOne({
      _id: ventureId,
      isDeleted: false,
    }).populate("createdBy", "firstName lastName email");

    if (!venture) {
      return res.status(404).json({ message: "Venture not found." });
    }

    return res.status(200).json({ data: venture });
  } catch (err) {
    console.error("getVentureById error:", err);
    return res.status(500).json({ message: "Failed to retrieve venture by ID." });
  }
};

export default getVentureById;
