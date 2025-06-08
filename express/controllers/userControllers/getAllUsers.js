import User from "../../models/User.js";
import logger from "../../config/logger.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
    logger.info('Fetched all users successfully');
  } catch (error) {
    logger.error('Error fetching users: %o', error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export default getAllUsers;
