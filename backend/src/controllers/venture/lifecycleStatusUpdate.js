// controllers/ventureController.js
import Venture from "../../models/Venture.js";

/**
 * Updates the lifecycleStatus of a venture (e.g., new → funded),
 * and automatically sets visibility to 'public' when appropriate.
 * Only accessible by admin users.
 */
const lifecycleStatusUpdate = async (req, res) => {
  const { ventureId } = req.params;
  const { lifecycleStatus } = req.body;

  // Validate authentication and role
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  // Validate required input
  if (!ventureId || lifecycleStatus === undefined) {
    return res.status(400).json({
      message: "ventureId and lifecycleStatus are required.",
    });
  }

  // Define allowed lifecycle statuses
  const allowedStatuses = ["coming-soon", "new", "funded", "repaid"];
  if (!allowedStatuses.includes(lifecycleStatus)) {
    return res.status(400).json({ message: "Invalid lifecycle status." });
  }

  try {
    // Build update object
    const updatedFields = {
      lifecycleStatus,
      history: {
        action: "status-update",
        field: "lifecycleStatus",
        newValue: lifecycleStatus,
        changedBy: req.user.id,
        changedAt: new Date(),
      },
    };

    // Auto-set visibility to 'public' for visible lifecycle stages
    if (["coming-soon", "new", "funded"].includes(lifecycleStatus)) {
      updatedFields.visibility = "public";
    }

    // Perform atomic update
    const updatedVenture = await Venture.findByIdAndUpdate(
      ventureId,
      {
        $set: updatedFields,
        $push: { history: updatedFields.history },
      },
      { new: true }
    );

    if (!updatedVenture) {
      return res.status(404).json({ message: "Venture not found." });
    }

    return res.status(200).json({
      message: "Lifecycle status updated successfully.",
      data: updatedVenture,
    });
  } catch (err) {
    console.error("Error updating lifecycle status:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default lifecycleStatusUpdate;
