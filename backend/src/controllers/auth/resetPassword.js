import bcrypt from "bcrypt";
import User from "../../models/User.js";

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "Email, token, and new password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (
      !user ||
      user.resetPasswordToken !== token ||
      !user.resetPasswordTokenExpiresAt ||
      user.resetPasswordTokenExpiresAt < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export default resetPassword;
