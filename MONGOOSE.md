# Mongoose Schemas

These are the mongoose schemas of this venture - investment website controlled mostly by admin

## List of Schemas

const userSchema = new mongoose.Schema(
  {
    // Basic User Info
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

    // Authentication & Security
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

    // Notifications & Preferences
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

    // Role & Account Status
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    // Login Metadata
    lastLoginAt: { type: Date },
    loginHistory: [
      {
        ip: { type: String },
        device: { type: String },
        timestamp: { type: Date },
      },
    ],
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

const balanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("Balance", balanceSchema);

// src/models/BalanceHistory.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const balanceHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balanceId: {
      type: Schema.Types.ObjectId,
      ref: "Balance",
      required: true,
    },
    amount: { type: Number, required: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    note: { type: String },
    proofImage: { type: String }, // Moved here — makes sense
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

export default mongoose.model("BalanceHistory", balanceHistorySchema);

const ventureSchema = new mongoose.Schema(
  {
    // Basic Info
    title: { type: String, required: true, maxlength: 255 },
    slug: { type: String, unique: true, required: true },
    shortDescription: { type: String },
    longDescription: { type: String },
    collateralDescription: { type: String },
    images: [String], // URLs to image assets

    // Location
    country: { type: String },

    // Public Status of the Venture
    status: {
      type: String,
      enum: ["new", "coming-soon", "funded", "repaid"],
      required: true,
    },

    // Venture Category
    ventureType: {
      type: String,
      enum: ["business", "sme", "leasing", "realestate"],
      required: true,
    },

    // Visibility Control
    visibility: {
      type: String,
      enum: ["public", "private", "draft"],
      default: "draft",
    },

    // Risk Assessment
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Investment Configuration
    minInvestmentAmount: { type: Number, default: 1000 },
    maxInvestmentAmount: { type: Number },
    targetAmount: { type: Number, required: true },
    amountFunded: { type: Number, required: true, default: 0 },
    expectedReturn: { type: Number, required: true }, // % return expected
    investmentPeriod: { type: Number, required: true }, // in months

    // Venture Lifecycle
    dateIssued: { type: Date },
    closingDate: { type: Date, required: true },

    // Admin Review Status
    adminStatus: {
      type: String,
      enum: ["pending", "under-review", "approved", "rejected"],
      default: "pending",
    },
    adminReviewedAt: { type: Date, default: null },
    adminNotes: { type: String, default: null },

    // Repayment Schedule (Amortization)
    schedules: [
      {
        scheduleDate: { type: Date },
        principal: { type: Number },
        interest: { type: Number },
        total: { type: Number },
        status: {
          type: String,
          enum: ["pending", "paid", "overdue"],
          default: "pending",
        },
      },
    ],

    // Financial Fields
    collateralValue: { type: Number },
    loanToValue: { type: Number }, // % ratio
    isConvertible: { type: Boolean, default: false }, // to equity

    // Optional Summary Totals (if needed)
    principal: { type: Number },
    interest: { type: Number },
    total: { type: Number },

    // Soft Delete Flag
    isDeleted: { type: Boolean, default: false },

    // Audit Fields
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default mongoose.model("Venture", ventureSchema);

const investmentSchema = new Schema(
  {
    venture: {
      type: Types.ObjectId,
      ref: "Venture",
      required: true,
      index: true,
    },

    // Amount invested by the user
    amount: { type: Number, required: true },

    // Date of investment
    investmentDate: { type: Date, default: Date.now },

    // Total profit paid to the investor so far
    profitPaid: { type: Number, default: 0 },

    // True if the original principal amount has been fully returned
    principalReturned: { type: Boolean, default: false },

    // expected return from this investment
    totalExpectedReturn: { type: Number },

    // Investment lifecycle status
    // - "invested" => Active investment (ongoing)
    // - "completed" => Maturity reached (awaiting full repayment)
    // - "repaid" => Profit and principal fully returned
    status: {
      type: String,
      enum: ["invested", "completed", "repaid"],
      default: "invested",
      index: true,
    },

    // Who made or last updated this investment
    investedBy: { type: Types.ObjectId, ref: "User", index: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model("Investment", investmentSchema);

const repaymentSchema = new mongoose.Schema(
  {
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["principal", "profit"],
      required: true,
    },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "paid", "rejected"],
      default: "pending",
      index: true,
    },
    note: { type: String },
    proofImage: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Repayment", repaymentSchema);

## Relationships Summary

User
 ├── Balance (1:1)
 ├── BalanceHistory (1:N)
 ├── Investment (1:N)
 ├── Repayment (1:N)
 ├── Created/Updated Ventures, Repayments, etc.
Venture
 ├── Investment (1:N)
 ├── CreatedBy / UpdatedBy
Investment
 ├── Repayment (1:N)
 └── Linked to Venture and User
