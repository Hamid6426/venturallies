import express from "express";
import startKycVerification from "../controllers/kyc/startKycVerification.js";
import handleLemVerifyWebhook from "../controllers/kyc/handleLemverifyWebhook.js";
import authMiddleware from "../middleware/isAuthenticated.js";
import fetchMyVerificationStatus from "../controllers/kyc/fetchMyVerificationStatus.js";

const router = express.Router();

function lemVerifyIpWhitelist(req, res, next) {
  const allowedIPs = ["34.247.111.53"];

  // This handles both IPv4 and IPv6 formats
  const getIP = (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
    return req.ip || req.connection.remoteAddress;
  };

  const requestIP = getIP(req).replace("::ffff:", "");
  console.log(`[LEMVERIFY IP CHECK] Incoming IP: ${requestIP}`);

  if (allowedIPs.includes(requestIP)) {
    next();
  } else {
    console.warn(`[LEMVERIFY IP CHECK] Blocked IP: ${requestIP}`);
    return res.status(403).json({ message: "Forbidden: Invalid IP address" });
  }
}

// Authenticated user starts a KYC verification
router.post("/start-verification", authMiddleware, startKycVerification);

// For lemverify comfirmation, same as webhook handler route
// Webhook GET check
router.get("/lemverify-webhook", (req, res) => {
  console.log(
    `[LEMVERIFY GET] Webhook verification ping received at ${new Date().toISOString()}`
  );
  console.log(`[LEMVERIFY GET] Headers:`, req.headers);
  console.log(`[LEMVERIFY GET] IP: ${req.ip}`);

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("ETag", ""); // disables conditional GETs
  res.status(200).send("OK");
});

// Webhook for receiving LEM verification updates
router.post(
  "/lemverify-webhook",
  express.raw({ type: "*/*" }), // raw body must be first
  lemVerifyIpWhitelist,
  (req, res) => {
    console.log(`[LEMVERIFY POST] Webhook received at ${new Date().toISOString()}`);
    const ip = req.headers["x-forwarded-for"] || req.ip;
    console.log(`[LEMVERIFY POST] IP: ${ip}`);
    console.log(`[LEMVERIFY POST] Headers:`, req.headers);
    console.log(`[LEMVERIFY POST] Raw Body:`, req.body.toString());

    try {
      const parsed = JSON.parse(req.body.toString());
      console.log(`[LEMVERIFY POST] Parsed JSON:`, parsed);
    } catch (err) {
      console.log(`[LEMVERIFY POST] Body is not valid JSON`);
    }

    res.status(200).send("Webhook Received");
  }
);

router.get("/my-verification", authMiddleware, fetchMyVerificationStatus);

export default router;
