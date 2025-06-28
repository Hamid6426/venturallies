import KYCVerification from "../../models/KYCVerification.js";

const handleLemVerifyWebhook = async (req, res) => {
  try {
    const data = req.body;
    const {
      id,
      type,
      friendlyId,
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

    const toDate = (ts) => (ts ? new Date(ts * 1000) : null);

    const existing = await KYCVerification.findOne({ lemverifySystemId: id });
    if (existing) return res.status(200).json({ message: "Already handled." });

    const original = await KYCVerification.findOne({
      lemverifyFriendlyId: friendlyId,
    });

    if (!original) {
      console.error("No matching record for friendlyId:", friendlyId);
      return res.status(404).json({ message: "KYC base record not found" });
    }

    const record = new KYCVerification({
      userId: original.userId,
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
    return res
      .status(500)
      .json({ message: "Failed to process LEM Verify webhook" });
  }
};

export default handleLemVerifyWebhook;
