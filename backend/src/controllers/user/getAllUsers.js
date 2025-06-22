// /controllers/admin/getAllUsers.js
import User from "../../models/User.js";
import logger from "../../config/logger.js";

const getAllUsers = async (req, res) => {
  try {
    const adminRole = req.user.role;

    if (adminRole !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const { page = 1, limit = 10, role, status, search } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });

    logger.info("Fetched users successfully");
  } catch (error) {
    logger.error("Error fetching users: %o", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export default getAllUsers;
