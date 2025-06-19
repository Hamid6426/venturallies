import Venture from "../../models/Venture.js";

const getAllVentures = async (req, res) => {
  try {
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

    // Parse and sanitize
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

    // Build filter
    const filter = {
      isDeleted: false, // Always exclude soft-deleted
    };

    if (lifecycleStatus) filter.lifecycleStatus = lifecycleStatus;
    if (ventureType) filter.ventureType = ventureType;
    if (adminStatus) filter.adminStatus = adminStatus;
    if (visibility) filter.visibility = visibility;
    if (riskLevel) filter.riskLevel = riskLevel;
    if (country) filter.country = country;

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
    console.error("getAllVentures error:", err);
    return res.status(500).json({ message: "Failed to fetch ventures." });
  }
};

export default getAllVentures;
