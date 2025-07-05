import express from "express";
import startKycVerification from "../controllers/kyc/startKycVerification.js";
import handleLemVerifyWebhook from "../controllers/kyc/handleLemverifyWebhook.js";
import authMiddleware from "../middleware/isAuthenticated.js";
import fetchMyVerificationStatus from "../controllers/kyc/fetchMyVerificationStatus.js";

const router = express.Router();

// Secure IP whitelist for LemVerify
function lemVerifyIpWhitelist(req, res, next) {
  const allowedIPs = [
    "34.247.111.53", // LEM EU
    "54.171.65.120", // LEM Ireland
    "54.216.62.43",  // Optional fallback
  ];

  const getIP = () => {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) return forwarded.split(",")[0].trim();
    return (req.ip || req.connection.remoteAddress || "").replace("::ffff:", "");
  };

  const clientIP = getIP();
  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Invalid IP address" });
  }
}

// Start KYC for authenticated users
router.post("/start-verification", authMiddleware, startKycVerification);

router.post(
  "/lemverify-webhook",
  lemVerifyIpWhitelist,
  handleLemVerifyWebhook
);

// ONLY USE THIS DURING INTEGRATION STEP, COMMNET OUT THE ONE ABOVE AT THAT TIME
// router.post("/lemverify-webhook", function (req, res) {
//   res.sendStatus(200);
// });

// Fetch user's own verification status
router.get("/my-verification", authMiddleware, fetchMyVerificationStatus);

export default router;
