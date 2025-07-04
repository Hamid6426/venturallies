import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.emailVerifiedAt) {
      return res
        .status(401)
        .json({ message: "Please verify your email first." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const payload = {
      id: user._id,
      role: user.role,
      email: user.email,
    };

    const expiresIn = rememberMe ? "24h" : "1h";
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 1 day or 1 hour
    });

    // Modern browsers treat cookies without SameSite specified as Lax. If you need cross-site cookies (e.g., for third-party embed or SSR), you must explicitly set SameSite="None" and secure: true under HTTPS, or the cookie will be rejected

    user.lastLoginAt = new Date();
    user.loginHistory.push({
      ip: req.ip,
      device: req.headers["user-agent"] || "Unknown",
      timestamp: new Date(),
    });

    await user.save();

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export default loginUser;
