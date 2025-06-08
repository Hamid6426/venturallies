import generateOTP from "../../helpers/generateOTP.js";
import User from "../../models/User.js";
import sendMail from "../../utils/sendMail.js";

const resendVerificationToken = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.emailVerifiedAt) {
      return res.status(400).json({ message: "Email already verified." });
    }

    // Generate new token
    const emailVerificationToken = generateOTP();
    const emailVerificationTokenExpiresAt = new Date(Date.now() + 3600 * 1000);

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpiresAt = emailVerificationTokenExpiresAt;

    await user.save();

    const verificationUrl = `${
      process.env.FRONTEND_BASE_URL
    }/verify-email?email=${encodeURIComponent(email)}`;

    const subject = "Please verify your email address";
    const html = `
      <p>Hello ${user.firstName || "User"},</p>
      <p>This is your verification code:</p>
      <p><strong>${emailVerificationToken}</strong></p>
      <p>Click the link below and enter this code to verify your email:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p><em>This link expires in 1 hour.</em></p>
    `;

    await sendMail({ to: email, subject, html });

    return res.status(200).json({ message: "Verification email resent." });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export default resendVerificationToken;
