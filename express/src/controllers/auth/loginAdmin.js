import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const loginAdmin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.emailVerifiedAt) {
      return res.status(401).json({ message: "Please verify your email first." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 🔥 Only allow admin logins
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const payload = {
      id: user._id,
      role: user.role,
      email: user.email,
    };

    const expiresIn = rememberMe ? "7d" : "1d";
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    user.lastLoginAt = new Date();
    user.loginHistory.push({
      ip: req.ip,
      device: req.headers["user-agent"] || "Unknown",
      timestamp: new Date(),
    });

    await user.save();

    return res.status(200).json({
      message: "Admin login successful.",
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

export default loginAdmin;
