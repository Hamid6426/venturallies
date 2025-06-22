import express from "express";
import getAllUsersBalanceDetails from "../controllers/balance/getAllUsersBalanceDetails.js";
import getBalanceByUserId from "../controllers/balance/getBalanceByUserId.js";
import adminAddBalance from "../controllers/balance/adminAddBalance.js";
import getMyBalance from "../controllers/balance/getMyBalance.js";
import getMyBalanceHistory from "../controllers/balance/getMyBalanceHistory.js";
import authMiddleware from "../middleware/isAuthenticated.js";
import getAllBalanceHistories from "../controllers/balance/getAllBalanceHistories.js";
import { uploadAddBalanceProof } from "../middleware/imageUpload.js";

const router = express.Router();

//  Admin: Fetch all balances with filters
router.get("/", authMiddleware, getAllUsersBalanceDetails);
router.get("/all-histories", authMiddleware, getAllBalanceHistories);

//  Admin: Get balance by userId (from param)
router.get("/id/:userId", authMiddleware, getBalanceByUserId);

//  Admin: Update balance for a user (top-up or deduct)
router.post(
  "/add-balance/:userId",
  authMiddleware,
  uploadAddBalanceProof,
  adminAddBalance
);

//  Authenticated user: Get own balance
router.get("/my-balance", authMiddleware, getMyBalance);

//  Admin/User: Get balance history
router.get("/:userId/history", authMiddleware, getMyBalanceHistory);

export default router;
