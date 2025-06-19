// src/models/Venture.js
import mongoose from "mongoose";
import HistorySubSchema from "./HistorySubSchema.js";

const ventureSchema = new mongoose.Schema(
  {
    // ─── Basic Info ───────────────────────────────────────────────────────────
    title:          { type: String, required: true, maxlength: 255 }, // Headline
    slug:           { type: String, unique: true, required: true },    // SEO & routing
    shortDescription: { type: String, required: true },                // List view
    longDescription:  { type: String, required: true },                // Full details
    collateralDescription: { type: String, required: true },           // Risk info
    images:         [String],                                          // Media assets
    country:        { type: String, required: true },                  // Location

    // ─── Status & Visibility ───────────────────────────────────────────────
    lifecycleStatus: {
      type: String,
      enum: ["new", "coming-soon", "funded", "repaid"],
      required: true,       // Public funding stage
    },
    visibility: {
      type: String,
      enum: ["public", "private", "draft"],
      default: "draft",     // Draft vs live
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",    // For investor risk filter
    },
    ventureType: {
      type: String,
      enum: ["business", "sme", "leasing", "realestate"],
      required: true,       // Category for filtering
    },

    // ─── Investment Terms ────────────────────────────────────────────────────
    minInvestmentAmount: { type: Number, required: true, default: 30 }, // €30 min
    maxInvestmentAmount: { type: Number, required: true },              // € cap
    targetAmount:        { type: Number, required: true },              // Goal
    amountFunded:        { type: Number, default: 0 },                  // Progress
    expectedReturn:      { type: Number, required: true },              // % for ROI
    investmentPeriod:    { type: Number, required: true },              // In months

    // ─── Timeline ───────────────────────────────────────────────────────────
    dateIssued:  { type: Date, required: true }, // When funding started
    closingDate: { type: Date, required: true }, // Funding deadline

    // ─── Repayment Schedule ─────────────────────────────────────────────────
    schedules: [
      {
        scheduleDate: Date,                   // When installment is due
        principal:    Number,                 // Principal portion
        interest:     Number,                 // Interest portion
        total:        Number,                 // Sum of principal+interest
        status: {
          type: String,
          enum: ["pending", "paid", "overdue"],
          default: "pending",
        },
      },
    ],

    // ─── Financial Summaries ────────────────────────────────────────────────
    collateralValue: { type: Number, required: true }, // Security value
    loanToValue:      { type: Number, required: true }, // Ratio %
    isConvertible:    { type: Boolean, default: false },// Equity option
    principal:        Number,  // Optional summary
    interest:         Number,  // Optional summary
    total:            Number,  // Optional summary

    // ─── Feature Flags & Metadata ──────────────────────────────────────────
    launchDate:   Date,         // Marketing
    goesLiveAt:   Date,         // Actual publish time
    tags:         [{ type: String, maxlength: 50 }], // Filters
    isFeatured:   { type: Boolean, default: false },// Homepage spotlight
    featuredUntil: Date,        // Expiry of feature
    isDeleted:    { type: Boolean, default: false },// Soft delete

    // ─── Ownership & Audit ──────────────────────────────────────────────────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,           // Who created this venture
    },

    // ─── Change History ─────────────────────────────────────────────────────
    history: [HistorySubSchema], // Audit trail of all major events
  },
  { timestamps: true }           // createdAt, updatedAt
);

export default mongoose.model("Venture", ventureSchema);
