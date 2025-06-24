import KYCVerification from "../../models/KYCVerification.js";
import User from "../../models/User.js";

const handleLemVerifyWebhook = async (req, res) => {
  try {
    const data = req.body;

    const {
      id,               // lemverifySystemId
      type,
      friendlyId,       // this is your clientRef (userId)
      processedAt,
      startedAt,
      deletionAt,
      result,
      balance,
      referMessage,
      person,
      liveperson,
      documents,
      alerts,
    } = data;

    // Convert timestamps to Date
    const toDate = (ts) => (ts ? new Date(ts * 1000) : null);

    // Optional: verify the clientRef is a valid ObjectId
    const userId = friendlyId;

    const existing = await KYCVerification.findOne({ lemverifySystemId: id });

    if (existing) {
      return res.status(200).json({ message: "Already handled." });
    }

    const record = new KYCVerification({
      userId,
      lemverifySystemId: id,
      lemverifyFriendlyId: friendlyId,
      lemverifyType: type,
      lemverifyResult: result,
      lemverifyProcessedAt: toDate(processedAt),
      lemverifyStartedAt: toDate(startedAt),
      lemverifyDeletionAt: toDate(deletionAt),
      lemverifyBalanceAtCheck: balance ?? null,
      lemverifyReferMessage: referMessage || null,
      lemverifyExtractedPerson: person || null,
      lemverifyExtractedLivePerson: liveperson || null,
      lemverifyExtractedDocuments: documents || [],
      lemverifyAlerts: alerts || [],
      clientRefSent: friendlyId,
      statusInOurSystem: "verification_complete",
      fullWebhookPayload: data,
    });

    await record.save();

    return res.status(200).json({ message: "KYC verification saved." });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ message: "Failed to process LEM Verify webhook" });
  }
};

export default handleLemVerifyWebhook;