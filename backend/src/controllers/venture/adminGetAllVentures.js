// src/controllers/venture/adminGetAllVentures.js
import Venture from "../../models/Venture.js";
import mongoose from "mongoose";

const adminGetAllVentures = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admins only." });
    }

    const {
      page = 1,
      limit = 10,
      lifecycleStatus,
      ventureType,
      adminStatus,
      visibility,
      riskLevel,
      country,
      tags,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const numericPage = Math.max(parseInt(page, 10), 1);
    const numericLimit = Math.max(parseInt(limit, 10), 1);
    const skip = (numericPage - 1) * numericLimit;
    const sortOrder = order === "asc" ? 1 : -1;

    const sortableFields = [
      "createdAt",
      "title",
      "lifecycleStatus",
      "targetAmount",
    ];
    const sortField = sortableFields.includes(sortBy) ? sortBy : "createdAt";

    const filter = { isDeleted: false };

    if (lifecycleStatus && lifecycleStatus !== "all") {
      filter.lifecycleStatus = lifecycleStatus;
    }
    if (ventureType && ventureType !== "all") {
      filter.ventureType = ventureType;
    }
    if (adminStatus && adminStatus !== "all") {
      filter.adminStatus = adminStatus;
    }
    if (visibility && visibility !== "all") {
      filter.visibility = visibility;
    }
    if (riskLevel && riskLevel !== "all") {
      filter.riskLevel = riskLevel;
    }
    if (country && country !== "all") {
      filter.country = country;
    }

    if (tags) {
      const tagArray = Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagArray };
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const [ventures, total] = await Promise.all([
      Venture.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(numericLimit),
      Venture.countDocuments(filter),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / numericLimit);

    return res.status(200).json({
      data: ventures,
      pagination: {
        total,
        page: numericPage,
        limit: numericLimit,
        totalPages,
      },
    });
  } catch (err) {
    console.error("adminGetAllVentures error:", err);
    return res.status(500).json({ message: "Failed to fetch ventures." });
  }
};

export default adminGetAllVentures;
