import User from "../../models/User.js";
import KYCVerification from "../../models/KYCVerification.js";

const startKycVerification = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findById(userId).select("email");

    if (!user || !user.email) {
      return res.status(404).json({ message: "User or email not found" });
    }

    const existing = await KYCVerification.findOne({
      userId,
      statusInOurSystem: "verification_pending",
    });

    if (existing) {
      return res.status(429).json({
        message: "Verification already in progress",
        verificationUrl: existing.verificationUrl,
      });
    }

    const payload = {
      clientRef: userId,
      sendEmail: user.email,
      amlRequired: true,
      redactMe: true,
    };

    const lemRes = await fetch(
      `https://api.lemverify.io/api/v1/${process.env.LEM_ACCOUNT_ID}/combination`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-lem-key": process.env.LEM_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!lemRes.ok) {
      let errorData;
      try {
        errorData = await lemRes.json();
      } catch {
        errorData = { raw: await lemRes.text() };
      }
      console.error("LEM error response:", errorData);
      return res.status(lemRes.status).json({
        message: "LEM Verify API error",
        details: errorData,
      });
    }

    const { url, id, friendlyId } = await lemRes.json();

    await KYCVerification.create({
      userId,
      lemverifySystemId: id,
      lemverifyFriendlyId: friendlyId,
      statusInOurSystem: "verification_pending",
      clientRefSent: userId.toString(), // Required field
    });

    return res.status(200).json({
      success: true,
      verificationUrl: url,
    });
  } catch (err) {
    console.error("LEM Verify request failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default startKycVerification;
