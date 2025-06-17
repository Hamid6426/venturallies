import Venture from "../../models/Venture.js";

const getAllVentures = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      ventureType,
      adminStatus,
      visibility,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const numericPage = parseInt(page, 10);
    const numericLimit = parseInt(limit, 10);
    const skip = (numericPage - 1) * numericLimit;

    const sortOrder = order === "asc" ? 1 : -1;
    const sortableFields = ["createdAt", "title", "status", "targetAmount"];
    const sortField = sortableFields.includes(sortBy) ? sortBy : "createdAt";

    // Filters
    const filter = {};
    if (status) filter.status = status;
    if (ventureType) filter.ventureType = ventureType;
    if (adminStatus) filter.adminStatus = adminStatus;
    if (visibility) filter.visibility = visibility;
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
    console.error("getAllVentures error:", err);
    res.status(500).json({ error: "Failed to fetch ventures." });
  }
};

export default getAllVentures;
