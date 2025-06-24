import axios from "axios";
import KYCVerification from "../../models/KYCVerification.js";

export const initiateKYC = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check for existing pending verification
    const existing = await KYCVerification.findOne({
      userId,
      statusInOurSystem: "verification_pending",
    });

    if (existing) {
      return res.status(200).json({ verificationUrl: existing.lemverifyUrl });
    }

    // Your config
    const LEM_ACCOUNT_ID = process.env.LEM_ACCOUNT_ID;
    const LEM_API_KEY = process.env.LEM_API_KEY;
    const clientRef = `user_${userId}_${Date.now()}`;

    const { data } = await axios.post(
      `https://api.lemverify.io/api/v1/${LEM_ACCOUNT_ID}/combination`,
      {
        clientRef,
        redactMe: false,
        amlRequired: false,
        requestSmartsearchReport: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-lem-key": LEM_API_KEY,
        },
      }
    );

    // Save partial data
    const saved = await KYCVerification.create({
      userId,
      lemverifySystemId: data.id,
      lemverifyFriendlyId: data.friendlyId,
      lemverifyType: "COMBINATION",
      lemverifyResult: "REFER", // Temporary until real result from webhook
      lemverifyProcessedAt: new Date(),
      clientRefSent: clientRef,
      lemverifyUrl: data.url,
    });

    return res.status(200).json({ verificationUrl: data.url });
  } catch (error) {
    console.error("initiateKYC error:", error.message);
    return res.status(500).json({ error: "Failed to initiate verification" });
  }
};
