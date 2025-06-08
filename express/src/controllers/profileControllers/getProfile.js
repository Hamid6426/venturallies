import User from "../../models/User.js";

const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select(
      "firstName lastName email phone country city address newsletterFrequency transactionNotification latestNewsNotification preferences avatarUrl role"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Profile fetch failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default getProfile;
