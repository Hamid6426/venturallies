import User from "../../models/User.js";
import logger from "../../config/logger.js";

const updateUser = async (req, res) => {
  try {
    const adminRole = req.user?.role;
    const adminId = req.user?.id;

    if (adminRole !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const { userId } = req.params; // assuming admin is updating a specific user
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info(`Admin ${adminId} updated user ${userId} successfully`);
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    logger.error("Error updating user: %o", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export default updateUser;
