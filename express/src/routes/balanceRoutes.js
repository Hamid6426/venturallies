import express from "express";
import getAllUsersBalanceDetails from "../controllers/balance/getAllUsersBalanceDetails.js";
import getBalanceByUserId from "../controllers/balance/getBalanceByUserId.js";
import updateBalance from "../controllers/balance/updateBalance.js";
import getMyBalance from "../controllers/balance/getMyBalance.js";
import getMyBalanceHistory from "../controllers/balance/getMyBalanceHistory.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

//  Admin: Fetch all balances with filters
router.get("/", authMiddleware, getAllUsersBalanceDetails);
  
//  Admin: Get balance by userId (from param)
router.get("/:userId", authMiddleware, getBalanceByUserId);

//  Admin: Update balance for a user (top-up or deduct)
router.put("/:userId", authMiddleware, updateBalance);

//  Authenticated user: Get own balance
router.get("/my/self", authMiddleware, getMyBalance);

//  Admin/User: Get balance history
router.get("/:userId/history", authMiddleware, getMyBalanceHistory);

export default router;
