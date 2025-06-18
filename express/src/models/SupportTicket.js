// models/SupportTicket.js
import { Schema, model } from "mongoose";

const supportTicketSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    category: {
      type: String,
      default: "General",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    response: {
      type: String,
    },
    notes: [
      {
        type: String,
      },
    ],
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolutionDate: {
      type: Date,
    },
    attachments: [
      {
        type: String, // File URL or path
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SupportTicket = model("SupportTicket", supportTicketSchema);
export default SupportTicket;
