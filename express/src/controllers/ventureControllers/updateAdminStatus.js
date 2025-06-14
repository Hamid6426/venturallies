// controllers/ventureController.js

import Venture from "../../models/Venture.js";

const updateAdminStatus = async (req, res) => {
  const { ventureId, adminStatus } = req.body;

  // Validate inputs
  if (!ventureId || !adminStatus) {
    return res
      .status(400)
      .json({ message: "ventureId and adminStatus are required" });
  }

  // Check admin role directly from JWT
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    // Update venture
    const updatedVenture = await Venture.findByIdAndUpdate(
      ventureId,
      {
        adminStatus,
        adminReviewedAt: new Date(),
        updatedBy: req.user.id,
      },
      { new: true }
    );

    if (!updatedVenture) {
      return res.status(404).json({ message: "Venture not found" });
    }

    return res.status(200).json(updatedVenture);
  } catch (err) {
    console.error("Error updating admin status:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default updateAdminStatus;
