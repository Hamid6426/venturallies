// src/models/HistorySubSchema.js
import mongoose from "mongoose";

/**
 * A reusable sub-schema for audit logging.
 * Records who did what, when, and what changed.
 */
const HistorySubSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      // e.g. 'created', 'status_changed', 'note_added', 'repayment_made'
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // Who performed the action
    },
    at: {
      type: Date,
      default: Date.now,
      // When the action occurred
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      // Detailed diff or payload of what changed
    },
  },
  { _id: false } // We don't need separate ObjectId for each history entry
);

export default HistorySubSchema;
