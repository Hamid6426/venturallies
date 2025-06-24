import express from "express";
import { handleLemverifyWebhook } from "../controllers/kycController.js";

const router = express.Router();

// Webhook endpoint
router.post("/lemverify-webhook", handleLemverifyWebhook);


export default router;
