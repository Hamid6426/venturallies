import mongoose from "mongoose";
import Venture from "../../models/Venture.js";

const getMyVentures = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: "Unauthorized or Invalid User ID" });
    }

    // Query params
    const {
      page = 1,
      limit = 10,
      status,
      ventureType,
      visibility,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const numericPage = parseInt(page, 10);
    const numericLimit = parseInt(limit, 10);
    const skip = (numericPage - 1) * numericLimit;

    // Validate sort order
    const sortOrder = order === "asc" ? 1 : -1;
    const sortableFields = ["createdAt", "title", "status", "targetAmount"];
    const sortField = sortableFields.includes(sortBy) ? sortBy : "createdAt";

    // Filters
    const filter = {
      createdBy: userId,
      isDeleted: false,
    };

    if (status) filter.status = status;
    if (ventureType) filter.ventureType = ventureType;
    if (visibility) filter.visibility = visibility;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Fetch data
    const [ventures, total] = await Promise.all([
      Venture.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(numericLimit),
      Venture.countDocuments(filter),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / numericLimit);

    res.status(200).json({
      ventures,
      pagination: {
        total,
        page: numericPage,
        limit: numericLimit,
        totalPages,
      },
    });
  } catch (err) {
    console.error("getMyVentures error:", err.message, err.stack);
    res.status(500).json({ error: "Failed to fetch your ventures." });
  }
};

export default getMyVentures;
