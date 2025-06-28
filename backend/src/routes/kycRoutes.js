import express from "express";
import startKycVerification from "../controllers/kyc/startKycVerification.js";
import handleLemVerifyWebhook from "../controllers/kyc/handleLemverifyWebhook.js";
import authMiddleware from "../middleware/isAuthenticated.js";
import lemVerifyIpWhitelist from "../middleware/lemVerifyIpWhitelist.js";
import fetchMyVerificationStatus from "../controllers/kyc/fetchMyVerificationStatus.js";

const router = express.Router();

// Authenticated user starts a KYC verification
router.post("/start-verification", authMiddleware, startKycVerification);

// For lemverify comfirmation, same as webhook handler route
router.get("/lemverify-webhook", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("ETag", ""); // disables conditional GETs
  res.status(200).send("OK");
});

// Webhook for receiving LEM verification updates
router.post(
  "/lemverify-webhook",
  lemVerifyIpWhitelist,
  express.json({ verify: (req, res, buf) => (req.rawBody = buf.toString()) }),
  handleLemVerifyWebhook
);

router.get("/my-verification", authMiddleware, fetchMyVerificationStatus);

export default router;
