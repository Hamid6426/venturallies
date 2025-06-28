import User from "../../models/User.js";
import KYCVerification from "../../models/KYCVerification.js";

const startKycVerification = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.log("StartKYC: Starting for user", userId);

    const user = await User.findById(userId).select("email");
    console.log("StartKYC: User fetched", user);

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

    console.log("StartKYC: Sending payload to LEM", payload);

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

    console.log("StartKYC: LEM status", lemRes.status);

    const lemData = await lemRes.json().catch(async () => {
      const raw = await lemRes.text();
      console.log("LEM raw response", raw);
      return { error: "Failed to parse JSON", raw };
    });

    if (!lemRes.ok) {
      console.error("LEM Verify API error:", lemData);
      return res.status(lemRes.status).json({
        message: "LEM Verify API error",
        details: lemData,
      });
    }

    console.log("StartKYC: LEM verify success", lemData);

    const { url, id, friendlyId } = lemData; // ✅ Use already-parsed lemData

    await KYCVerification.create({
      userId,
      lemId: id,
      friendlyId: friendlyId,
      lemverifySystemId: id,
      lemverifyFriendlyId: friendlyId,
      verificationUrl: url,
      clientRefSent: userId.toString(),
      statusInOurSystem: "verification_pending",
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
