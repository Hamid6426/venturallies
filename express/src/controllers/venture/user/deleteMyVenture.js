// controllers/ventureController.js
import Venture from "../../models/Venture.js";
import mongoose from "mongoose";

/**
 * Marks the venture as deleted (soft delete) if the user is the creator.
 */
const deleteMyVenture = async (req, res) => {
  const { ventureId } = req.params;
  const userId = req.user?.id;

  // Basic validation
  if (!ventureId || !mongoose.Types.ObjectId.isValid(ventureId)) {
    return res.status(400).json({ message: "Invalid venture ID." });
  }

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized or invalid user ID." });
  }

  try {
    // Ensure venture exists and is owned by this user
    const venture = await Venture.findOne({ _id: ventureId, createdBy: userId });

    if (!venture) {
      return res.status(404).json({ message: "Venture not found or not owned by you." });
    }

    // Update isDeleted flag
    venture.isDeleted = true;
    await venture.save();

    return res.status(200).json({ message: "Venture deleted (soft) successfully." });
  } catch (err) {
    console.error("deleteMyVenture error:", err);
    return res.status(500).json({ message: "Server error while deleting venture." });
  }
};

export default deleteMyVenture;
