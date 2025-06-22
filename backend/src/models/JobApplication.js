// src/models/JobApplication.js
import mongoose from "mongoose";
import HistorySubSchema from "./HistorySubSchema.js";

const { Schema, model } = mongoose;

const jobApplicationSchema = new Schema(
  {
    // ─── Link to the Job post they’re applying for ───────────────────────────
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      // Which job (or listing) this application is for
    },

    // ─── Applicant’s Contact & Profile Info ─────────────────────────────────
    name: {
      type: String,
      required: true,
      trim: true,
      // Full name as entered on the form
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      // Email address for follow-up
    },
    phone: {
      type: String,
      trim: true,
      // Optional phone number
    },
    address: {
      type: String,
      // Optional mailing address
    },

    // ─── Application Materials ────────────────────────────────────────────────
    resumeUrl: {
      type: String,
      // URL to uploaded CV/resume file
    },
    coverLetter: {
      type: String,
      // Free-form text (or rich-text) cover letter
    },
    portfolioUrls: [String],
    // Optional array of links (e.g. personal website, GitHub, Dribbble)

    // ─── Application Status Flow ─────────────────────────────────────────────
    status: {
      type: String,
      enum: ["applied", "reviewing", "interview", "offer", "hired", "rejected"],
      default: "applied",
      index: true,
      // Where in the pipeline this application sits
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      // Timestamp when the form was submitted
    },
    reviewedAt: {
      type: Date,
      // When status changed to “reviewing”
    },

    // ─── Admin Notes & Attachments ───────────────────────────────────────────
    notes: [
      {
        type: String,
        // Quick textual notes by reviewers (freeform)
      },
    ],
    attachments: [
      {
        type: String,
        // URLs to any other uploaded documents (certificates, etc.)
      },
    ],

    // ─── Audit Trail ─────────────────────────────────────────────────────────
    history: [HistorySubSchema],
    // Records each status change, note-additions, or any manual edits
  },
  {
    timestamps: true,  
    // createdAt = appliedAt, updatedAt = last modified
  }
);

export default model("JobApplication", jobApplicationSchema);
