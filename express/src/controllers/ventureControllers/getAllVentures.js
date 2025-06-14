import Venture from "../models/Venture.js";

const getAllVentures = async (req, res) => {
  try {
    // 🔍 Filters from query
    const {
      page = 1,
      limit = 10,
      status,
      ventureType,
      adminStatus,
      visibility,
      search,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (ventureType) filter.ventureType = ventureType;
    if (adminStatus) filter.adminStatus = adminStatus;
    if (visibility) filter.visibility = visibility;

    if (search) {
      filter.title = { $regex: search, $options: "i" }; // case-insensitive title search
    }

    const skip = (page - 1) * limit;

    const [ventures, total] = await Promise.all([
      Venture.find(filter)
        .sort({ createdAt: -1 }) // latest first
        .skip(Number(skip))
        .limit(Number(limit)),
      Venture.countDocuments(filter),
    ]);

    res.status(200).json({
      ventures,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("getAllVentures error:", err);
    res.status(500).json({ error: "Failed to fetch ventures." });
  }
};

export default getAllVentures;