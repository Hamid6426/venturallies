import mongoose from "mongoose";
import Venture from "../../models/Venture.js";

const getVentureById = async (req, res) => {
  try {
    const { ventureId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ventureId)) {
      return res.status(400).json({ error: "Invalid Venture ID." });
    }

    const venture = await Venture.findById(ventureId).populate(
      "createdBy",
      "firstName lastName email"
    );

    if (!venture) {
      return res.status(404).json({ error: "Venture not found" });
    }

    res.status(200).json(venture);
  } catch (err) {
    console.error("getVentureById error:", err);
    res.status(500).json({ error: "Failed to retrieve venture by ID." });
  }
};

export default getVentureById;
