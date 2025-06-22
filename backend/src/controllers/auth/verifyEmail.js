import User from "../../models/User.js";

const verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.body; // now coming from req.body

    if (!email || !token) {
      return res.status(400).json({ message: "Email and token are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.emailVerifiedAt) {
      return res.status(400).json({ message: "Email already verified." });
    }

    if (
      user.emailVerificationToken !== Number(token) || // ensure numeric check
      !user.emailVerificationTokenExpiresAt ||
      user.emailVerificationTokenExpiresAt < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Update verification status
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiresAt = undefined;

    await user.save();

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export default verifyEmail;
