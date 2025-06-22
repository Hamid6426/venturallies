import User from "../../models/User.js";
import logger from "../../config/logger.js";

const deleteUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const adminRole = req.user.role;

    if (adminRole !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const { userId } = req.params;

    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info(`Admin ${adminId} deleted user ${userId}`);
    res.status(200).json({ message: "User account deleted" });
  } catch (error) {
    logger.error("Error deleting user: %o", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export default deleteUser;
