import Venture from "../../models/Venture.js";

/**
 * Admin-only: Updates the adminStatus and optionally adminNote.
 * Automatically adjusts visibility & goesLiveAt based on status.
 */
const adminStatusUpdate = async (req, res) => {
  const { ventureId } = req.params;
  const { adminStatus, adminNote } = req.body;

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  if (!ventureId || adminStatus === undefined) {
    return res
      .status(400)
      .json({ message: "ventureId and adminStatus are required." });
  }

  const allowedStatuses = ["pending", "under-review", "approved", "rejected"];
  if (!allowedStatuses.includes(adminStatus)) {
    return res.status(400).json({ message: "Invalid admin status." });
  }

  try {
    const historyEntry = {
      action: "status-update",
      field: "adminStatus",
      newValue: adminStatus,
      changedBy: req.user._id,
      changedAt: new Date(),
    };

    const updates = {
      adminStatus,
      adminNote: adminNote || "",
      updatedBy: req.user._id,
    };

    if (adminStatus !== "pending") {
      updates.adminReviewedAt = new Date();
    }

    if (adminStatus === "approved") {
      updates.goesLiveAt = new Date();
      updates.visibility = "public";
    } else if (adminStatus === "rejected") {
      updates.visibility = "draft";
      updates.goesLiveAt = null;
    }

    const updatedVenture = await Venture.findByIdAndUpdate(
      ventureId,
      {
        $set: updates,
        $push: { history: historyEntry },
      },
      { new: true }
    );

    if (!updatedVenture) {
      return res.status(404).json({ message: "Venture not found." });
    }

    return res.status(200).json({
      message: "Admin status updated successfully.",
      data: updatedVenture,
    });
  } catch (err) {
    console.error("Error updating admin status:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default adminStatusUpdate;
