import User from "../../models/User.js";
import logger from "../../config/logger.js";

const getUserById = async (req, res) => {
  try {
    const adminRole = req.user?.role;

    if (adminRole !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info(`Fetched user ${userId} successfully`);
    res.status(200).json({ user });
  } catch (error) {
    logger.error("Error fetching user by ID: %o", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export default getUserById;
