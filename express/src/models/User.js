import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ──────────────────────
    // Basic User Info
    // ──────────────────────
    firstName: { type: String, maxlength: 100 },
    lastName: { type: String, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 255,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String, maxlength: 50 },
    countryName: { type: String, maxlength: 100 },
    countryCode: { type: String, maxlength: 2 },
    city: { type: String, maxlength: 100 },
    address: { type: String },
    avatarUrl: { type: String },

    // ──────────────────────
    // Authentication & Security
    // ──────────────────────

    // A 6 digit OTP code is used for verification
    emailVerifiedAt: { type: Date, default: null },
    emailVerificationToken: { type: Number },
    emailVerificationTokenExpiresAt: { type: Date, default: null },

    // A 6 digit OTP code is used for verification
    loginToken: { type: Number }, // OTP password for login
    loginTokenExpiresAt: { type: Date, default: null },

    // A 6 digit OTP code is used for verification
    resetPasswordToken: { type: Number },
    resetPasswordTokenExpiresAt: { type: Date, default: null },

    // ──────────────────────
    // Notifications & Preferences
    // ──────────────────────
    newsletterFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", "never"],
      default: "weekly",
    },
    transactionNotification: { type: Boolean, default: true },
    latestNewsNotification: { type: Boolean, default: true },
    preferences: {
      type: Object,
      default: {
        darkMode: false,
        language: "en",
      },
    },

    // ──────────────────────
    // Role & Account Status
    // ──────────────────────
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    // ──────────────────────
    // Login Metadata
    // ──────────────────────
    lastLoginAt: { type: Date },
    loginHistory: [{ ip: String, device: String, timestamp: Date }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
