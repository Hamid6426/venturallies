// src/controllers/ventureUpdateByAdmin.js
import Venture from "../../../models/Venture.js";

const ventureUpdateByAdmin = async (req, res) => {
  try {
    const { ventureId } = req.params;

    // Whitelisted fields admin is allowed to update
    const allowedFields = [
      "title",
      "slug",
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
      "dateIssued",
      "closingDate",
      "collateralValue",
      "loanToValue",
      "isConvertible",
      "tags",
      "images",
      "launchDate",
      "goesLiveAt",
      "visibility",
      "isFeatured",
      "featuredUntil",
      "adminStatus",
      "adminNotes",
    ];

    const updates = {};
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    // Optional field validations
    const numberFields = [
      "minInvestmentAmount",
      "maxInvestmentAmount",
      "targetAmount",
      "expectedReturn",
      "investmentPeriod",
      "collateralValue",
      "loanToValue",
    ];

    for (const field of numberFields) {
      if (updates[field] !== undefined && isNaN(Number(updates[field]))) {
        return res.status(400).json({ error: `${field} must be a number.` });
      }
    }

    const dateFields = [
      "dateIssued",
      "closingDate",
      "launchDate",
      "goesLiveAt",
      "featuredUntil",
    ];
    for (const field of dateFields) {
      if (updates[field] && isNaN(new Date(updates[field]).getTime())) {
        return res
          .status(400)
          .json({ error: `${field} must be a valid date.` });
      }
    }

    if (Array.isArray(updates.tags)) {
      updates.tags = updates.tags
        .map((tag) => tag.toLowerCase().trim())
        .slice(0, 10);
    }

    if (updates.images && !Array.isArray(updates.images)) {
      updates.images = [];
    }

    const venture = await Venture.findById(ventureId);
    if (!venture) {
      return res.status(404).json({ error: "Venture not found." });
    }

    const adminId = req.user?.id;
    const adminRole = req.user?.role;

    if (adminRole !== "admin") {
      return res.status(403).json({ error: "Only admin is allowed." });
    }

    Object.assign(venture, updates, {
      updatedBy: adminId,
    });

    if (updates.adminStatus) {
      venture.adminReviewedAt = new Date();
    }

    await venture.save();

    res.status(200).json({ message: "Venture updated by admin.", venture });
  } catch (err) {
    console.error("updateVentureByAdmin error:", err);
    res.status(500).json({ error: "Failed to update venture." });
  }
};

export default ventureUpdateByAdmin;
