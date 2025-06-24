import Venture from "../../models/Venture.js";

// GET /api/ventures
const getAllVentures = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      lifecycleStatus,
      ventureType,
      riskLevel,
      country,
      tags,
      search,
      closingIn,
      minInvestment,
      expectedReturn,
      isConvertible,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // ─── Pagination Setup ──────────────────────────────
    const numericPage = Math.max(parseInt(page, 10), 1);
    const numericLimit = Math.max(parseInt(limit, 10), 1);
    const skip = (numericPage - 1) * numericLimit;
    const sortOrder = order === "asc" ? 1 : -1;
    const sortableFields = ["createdAt", "title", "lifecycleStatus", "targetAmount"];
    const sortField = sortableFields.includes(sortBy) ? sortBy : "createdAt";

    // ─── Build Filters ────────────────────────────────
    const filter = {
      isDeleted: false,
      adminStatus: "approved",
      visibility: "public",
      ...(lifecycleStatus && lifecycleStatus !== "all" && { lifecycleStatus }),
      ...(ventureType && ventureType !== "all" && { ventureType }),
      ...(riskLevel && riskLevel !== "all" && { riskLevel }),
      ...(country && country !== "all" && { country }),
      ...(minInvestment && !isNaN(minInvestment) && {
        minInvestmentAmount: { $gte: parseFloat(minInvestment) },
      }),
      ...(expectedReturn && !isNaN(expectedReturn) && {
        expectedReturn: { $gte: parseFloat(expectedReturn) },
      }),
      ...(typeof isConvertible !== "undefined" && isConvertible !== "" && {
        isConvertible: isConvertible === "true",
      }),
    };

    // ─── Tags Filter ───────────────────────────────────
    if (tags) {
      const tagArray = Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim());
      if (tagArray.length > 0) {
        filter.tags = { $in: tagArray };
      }
    }

    // ─── Search Filter ─────────────────────────────────
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { longDescription: { $regex: search, $options: "i" } },
      ];
    }

    // ─── Closing Date Filter ───────────────────────────
    if (closingIn) {
      const days = parseInt(closingIn.replace("d", ""));
      if (!isNaN(days)) {
        const now = new Date();
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + days);
        filter.closingDate = { $lte: targetDate };
      }
    }

    // ─── Fetch Data ────────────────────────────────────
    const [ventures, total] = await Promise.all([
      Venture.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(numericLimit),
      Venture.countDocuments(filter),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / numericLimit);

    // ─── Return Response ───────────────────────────────
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
