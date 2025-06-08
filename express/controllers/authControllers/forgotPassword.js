import User from "../../models/User.js";
import sendMail from "../../utils/sendMail.js";
import generateOTP from "../../helpers/generateOTP.js";

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: "User not found." });

    // Generate OTP + 1hr expiry
    const resetPasswordToken = generateOTP();
    const resetPasswordTokenExpiresAt = new Date(Date.now() + 3600 * 1000);

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;
    await user.save();

    const resetUrl = `${
      process.env.FRONTEND_BASE_URL
    }/reset-password?email=${encodeURIComponent(email)}`;

    const subject = "Reset Your Password";
    const html = `
      <p>Hello ${user.firstName || "User"},</p>
      <p>You requested to reset your password.</p>
      <p><strong>Your OTP is: ${resetPasswordToken}</strong></p>
      <p>Enter this code on the reset password page to proceed:</p>
      <a href="${resetUrl}">Reset Link</a>
      <p>This OTP will expire in 1 hour. If you didn't request this, you can ignore this email.</p>
    `;

    await sendMail({ to: email, subject, html });

    return res
      .status(200)
      .json({ message: "Password reset OTP sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export default forgotPassword;
