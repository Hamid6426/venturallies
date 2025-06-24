// controllers/lemVerifyController.js
import User from "../../models/User.js";

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

    const payload = {
      clientRef: userId,
      sendEmail: user.email,
      // redactMe: true,
      // amlRequired: true,
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
      const errorData = await lemRes.json();
      console.error("LEM error response:", errorData);
      return res.status(lemRes.status).json({
        message: "LEM Verify API error",
        details: errorData,
      });
    }

    const data = await lemRes.json();

    return res.status(200).json({
      success: true,
      verificationUrl: data.url,
    });
  } catch (err) {
    console.error("LEM Verify request failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default startKycVerification;