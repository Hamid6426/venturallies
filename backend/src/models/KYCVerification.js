import mongoose from "mongoose";

const kycVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lemverifySystemId: { type: String, required: true, unique: true },
    lemverifyFriendlyId: { type: String, required: true },
    lemverifyType: {
      type: String,
      enum: ["COMBINATION", "DOCUMENT", "LIVENESS", "AML_ALERT"],
      required: true,
    },
    lemverifyResult: {
      type: String,
      enum: ["PASSED", "REFER", "ERROR", "ALERT"],
      required: true,
    },
    lemverifyProcessedAt: { type: Date, required: true },
    lemverifyStartedAt: { type: Date, default: null },
    lemverifyDeletionAt: { type: Date, default: null },
    lemverifyBalanceAtCheck: { type: Number, default: null },
    lemverifyReferMessage: { type: String, default: null },
    lemverifyExtractedPerson: { type: Object, default: null },
    lemverifyExtractedLivePerson: { type: Object, default: null },
    lemverifyExtractedDocuments: { type: [Object], default: [] },
    lemverifyAlerts: { type: [Object], default: [] },

    clientRefSent: { type: String, required: true, maxlength: 255 },
    statusInOurSystem: {
      type: String,
      enum: ["verification_pending", "verification_complete"],
      default: "verification_pending",
      required: true,
    },
    fullWebhookPayload: { type: Object, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("KYCVerification", kycVerificationSchema);
