// src/models/Venture.js
import mongoose from "mongoose";

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

    // Launch Scheduling
    launchDate: { type: Date, default: null }, // for UI marketing
    goesLiveAt: { type: Date, default: null }, // for actual visibility logic

    // Tags
    tags: [{ type: String, maxlength: 50 }], // for category filters

    // Homepage Feature
    isFeatured: { type: Boolean, default: false },
    featuredUntil: { type: Date, default: null },

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
