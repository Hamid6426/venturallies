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
      default: null,
    },
    lemverifyResult: {
      type: String,
      enum: ["PASSED", "REFER", "ERROR", "ALERT"],
      default: null,
    },
    lemverifyProcessedAt: { type: Date, default: null },
    lemverifyStartedAt: { type: Date, default: null },
    lemverifyDeletionAt: { type: Date, default: null },
    lemverifyBalanceAtCheck: { type: Number, default: null },
    lemverifyReferMessage: { type: String, default: null },
    lemverifyExtractedPerson: { type: Object, default: null },
    lemverifyExtractedLivePerson: { type: Object, default: null },
    lemverifyExtractedDocuments: { type: [Object], default: [] },
    lemverifyAlerts: { type: [Object], default: [] },

    lemId: { type: String, required: true, unique: true }, // Add this
    friendlyId: { type: String, required: true }, // Add this
    verificationUrl: { type: String, required: true }, // Add this

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
