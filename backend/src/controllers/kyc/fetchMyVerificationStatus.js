// GET /api/kyc/my-verification
import KYCVerification from "../../models/KYCVerification.js";

const fetchMyVerificationStatus = async (req, res) => {
  try {
    const verification = await KYCVerification.findOne({ userId: req.user.id });

    if (!verification) {
      return res.status(200).json({ statusInOurSystem: null });
    }

    return res.status(200).json({
      statusInOurSystem: verification.statusInOurSystem,
    });
  } catch (err) {
    console.error("Fetch KYC error:", err);
    return res
      .status(500)
      .json({ message: "Could not fetch verification status" });
  }
};

export default fetchMyVerificationStatus;
