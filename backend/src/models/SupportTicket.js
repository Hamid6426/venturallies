// src/models/SupportTicket.js
import mongoose from "mongoose";
import HistorySubSchema from "./HistorySubSchema.js";

const { Schema, model } = mongoose;

const supportTicketSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // Ticket submitter name
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      // Ticket submitter email
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // Optional link to a registered user
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      // Brief summary of the issue
    },
    description: {
      type: String,
      required: true,
      // Detailed explanation
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
      // Urgency level
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
      // Current ticket state
    },
    category: {
      type: String,
      default: "General",
      // e.g. “Billing”, “Technical”, etc.
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      // Which admin/team member is handling it
    },
    response: {
      type: String,
      // Latest support response (optional free-form)
    },
    notes: [
      {
        type: String,
        // Quick, informal notes (you can also move notes into history if you like)
      },
    ],
    isResolved: {
      type: Boolean,
      default: false,
      // Convenience flag
    },
    resolutionDate: {
      type: Date,
      // When the ticket was marked resolved
    },
    attachments: [
      {
        type: String, // File URL or path
      },
    ],

    // ─── Change History ────────────────────────────────────────────────
    history: [HistorySubSchema],
    // Detailed audit trail: status changes, priority changes, responses added, etc.
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default model("SupportTicket", supportTicketSchema);
