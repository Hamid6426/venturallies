// src/models/Venture.js
import mongoose from "mongoose";
import HistorySubSchema from "./HistorySubSchema.js";

const ventureSchema = new mongoose.Schema(
  {
    // ─── Basic Info ───────────────────────────────────────────────────────────
    title: { type: String, required: true, maxlength: 255 }, // Headline
    slug: { type: String, unique: true, required: true }, // SEO & routing
    shortDescription: { type: String, required: true }, // List view
    longDescription: { type: String, required: true }, // Full details
    collateralDescription: { type: String, required: true }, // Risk info
    country: { type: String, required: true }, // Location

    // ─── Status & Visibility ───────────────────────────────────────────────
    lifecycleStatus: {
      type: String,
      enum: ["coming-soon", "new", "funded", "repaid"],
      default: "coming-soon", // Public funding stage
    },
    visibility: {
      type: String,
      enum: ["draft", "public", "private"],
      default: "draft", // Draft vs live
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium", // For investor risk filter
    },
    ventureType: {
      type: String,
      enum: ["business", "sme", "leasing", "realestate"],
      required: true, // Category for filtering
    },

    // ─── Admin Review Flow ─────────────────────────────────────────────
    adminStatus: {
      type: String,
      enum: ["pending", "under-review", "approved", "rejected"],
      default: "pending", // Required for admin review workflow
    },
    adminNote: {
      type: String,
      maxlength: 1000,
    },
    adminReviewedAt: {
      type: Date,
    },
    goesLiveAt: {
      type: Date,
    }, // When the venture was approved for public listing

    // ─── Investment Terms ────────────────────────────────────────────────────
    minInvestmentAmount: { type: Number, required: true, default: 30 }, // €30 min
    maxInvestmentAmount: { type: Number, required: true }, // € cap
    targetAmount: { type: Number, required: true }, // Goal
    amountFunded: { type: Number, default: 0 }, // Progress
    expectedReturn: { type: Number, required: true }, // % for ROI
    investmentPeriod: { type: Number, required: true }, // In months

    // ─── Timeline ───────────────────────────────────────────────────────────
    dateIssued: { type: Date, default: null }, // When funding started after it goes live
    closingDate: { type: Date, required: true }, // Funding deadline

    // ─── Repayment Schedule ─────────────────────────────────────────────────
    schedules: [
      {
        scheduleDate: Date, // When installment is due
        principal: Number, // Principal portion
        interest: Number, // Interest portion
        total: Number, // Sum of principal+interest
        status: {
          type: String,
          enum: ["pending", "paid", "overdue"],
          default: "pending",
        },
      },
    ],

    // ─── Financial Summaries ────────────────────────────────────────────────
    collateralValue: { type: Number, required: true }, // Security value
    loanToValue: { type: Number, required: true }, // Ratio %
    principal: Number, // Optional summary
    interest: Number, // Optional summary
    total: Number, // Optional summary
    isConvertible: {
      type: Boolean,
      default: false,
      // Convertible: Investors have the opportunity to convert their loan
      // either partially or fully at a specified time into equity,
      // allowing them to share in the company's future growth and success.
      // come with low interest rates than non-convertibles
    }, // Equity option

    // ─── Feature Flags & Metadata ──────────────────────────────────────────
    tags: [{ type: String, maxlength: 50 }], // Filters
    isDeleted: { type: Boolean, default: false }, // Soft delete
    // launchDate: Date, // Marketing (not in MVP)
    // goesLiveAt: Date, // Actual publish time (not in MVP)
    // isFeatured: { type: Boolean, default: false }, // Homepage spotlight
    // featuredUntil: Date, // Expiry of feature

    // ─── Media ──────────────────────────────────────────
    images: [String], // Media assets

    // ─── Ownership & Audit ──────────────────────────────────────────────────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Who created this venture
    },

    // ─── Change History ─────────────────────────────────────────────────────
    history: [HistorySubSchema], // Audit trail of all major events
  },
  { timestamps: true } // createdAt, updatedAt
);

export default mongoose.model("Venture", ventureSchema);
