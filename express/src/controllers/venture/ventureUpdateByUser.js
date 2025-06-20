// src/controllers/ventureUpdateByUser.js
import Venture from "../../models/Venture.js";

const ventureUpdateByUser = async (req, res) => {
  try {
    const { ventureId } = req.params;

    const allowedFields = [
      "title",
      "shortDescription",
      "longDescription",
      "collateralDescription",
      "country",
      "lifecycleStatus",
      "ventureType",
      "riskLevel",
      "minInvestmentAmount",
      "maxInvestmentAmount",
      "targetAmount",
      "expectedReturn",
      "investmentPeriod",
      "closingDate",
      "collateralValue",
      "loanToValue",
      "isConvertible",
      "tags",
      "images",
    ];

    const updates = {};
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    // Basic type checks
    const numericFields = [
      "minInvestmentAmount",
      "maxInvestmentAmount",
      "targetAmount",
      "expectedReturn",
      "investmentPeriod",
      "collateralValue",
      "loanToValue",
    ];

    for (const field of numericFields) {
      if (updates[field] !== undefined && isNaN(Number(updates[field]))) {
        return res.status(400).json({ error: `${field} must be a number.` });
      }
    }

    if (
      updates.closingDate &&
      isNaN(new Date(updates.closingDate).getTime())
    ) {
      return res.status(400).json({ error: "Invalid closingDate." });
    }

    if (Array.isArray(updates.tags)) {
      updates.tags = updates.tags
        .map((tag) => tag.toLowerCase().trim())
        .slice(0, 10);
    }

    if (updates.images && !Array.isArray(updates.images)) {
      updates.images = []; // fallback
    }

    // Fetch venture
    const venture = await Venture.findById(ventureId);
    if (!venture) {
      return res.status(404).json({ error: "Venture not found." });
    }

    // Ownership check
    const userId = req.user?.id;

    if (!venture.createdBy.equals(userId)) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this venture." });
    }

    // Assign updates
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        venture[field] = updates[field];
      }
    });

    venture.updatedBy = req.user._id;
    await venture.save();

    res.status(200).json({ message: "Venture updated by user.", venture });
  } catch (err) {
    console.error("updateVentureByUser error:", err);
    res.status(500).json({ error: "Failed to update venture." });
  }
};

export default ventureUpdateByUser;
