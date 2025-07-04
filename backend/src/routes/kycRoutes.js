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
    "54.216.62.43", // Optional fallback
  ];

  const getIP = () => {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) return forwarded.split(",")[0].trim();
    return (req.ip || req.connection.remoteAddress || "").replace(
      "::ffff:",
      ""
    );
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

// LEMVerify webhook "ping" route (keep for initial handshake)
router.get("/lemverify-webhook", lemVerifyIpWhitelist, (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("ETag", "");
  res.sendStatus(200); // Empty 200
});

// LEMVerify webhook listener
router.post(
  "/lemverify-webhook",
  express.raw({ type: "*/*" }), // Needed for signature parsing
  lemVerifyIpWhitelist,
  handleLemVerifyWebhook
);

// Fetch user's own verification status
router.get("/my-verification", authMiddleware, fetchMyVerificationStatus);

export default router;
