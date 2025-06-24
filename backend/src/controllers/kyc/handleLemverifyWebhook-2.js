import KYCVerification from "../../models/KYCVerification.js";

export const handleLemverifyWebhook = async (req, res) => {
  try {
    const {
      id: systemId,
      friendlyId,
      type,
      result,
      processedAt,
      startedAt,
      deletionAt,
      balance,
      referMessage,
      person,
      documents,
      liveperson,
      alerts,
    } = req.body;

    // Extract clientRef (you used it as userId in initial request)
    const clientRef = friendlyId;

    // You might want to convert Unix timestamps to JS Dates
    const processedDate = new Date(processedAt * 1000);
    const startedDate = startedAt ? new Date(startedAt * 1000) : null;
    const deletionDate = deletionAt ? new Date(deletionAt * 1000) : null;

    // Update existing KYC verification record
    const updated = await KYCVerification.findOneAndUpdate(
      { clientRefSent: clientRef },
      {
        lemverifySystemId: systemId,
        lemverifyFriendlyId: friendlyId,
        lemverifyType: type,
        lemverifyResult: result,
        lemverifyProcessedAt: processedDate,
        lemverifyStartedAt: startedDate,
        lemverifyDeletionAt: deletionDate,
        lemverifyBalanceAtCheck: balance,
        lemverifyReferMessage: referMessage || null,
        lemverifyExtractedPerson: person || null,
        lemverifyExtractedDocuments: documents || [],
        lemverifyExtractedLivePerson: liveperson || null,
        lemverifyAlerts: alerts || [],
        statusInOurSystem: "verification_complete",
        fullWebhookPayload: req.body,
      },
      { new: true }
    );

    if (!updated) {
      console.warn("⚠️ No matching KYC record found for clientRef:", clientRef);
    }

    // Respond with 200 as required by LEMVerify
    return res.status(200).send(); // must be 200 with empty body
  } catch (error) {
    console.error("LEMVerify Webhook Error:", error.message);
    return res.status(500).json({ error: "Webhook handling failed" });
  }
};
  