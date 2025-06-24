// src/routes/withdrawalRoutes.js
import express from "express";
import authMiddleware from "../middleware/isAuthenticated.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

import createWithdrawalRequest from "../controllers/withdrawal/createWithdrawalRequest.js";
import approveWithdrawal from "../controllers/withdrawal/approveWithdrawal.js";
import rejectWithdrawal from "../controllers/withdrawal/rejectWithdrawal.js";
import getWithdrawalRequestById from "../controllers/withdrawal/getWithdrawalRequestById.js";
import getAllWithdrawalRequests from "../controllers/withdrawal/getAllWithdrawalRequests.js";

const router = express.Router();

// ───── User Route ─────
router.post("/", authMiddleware, authorizeRoles("user"), createWithdrawalRequest);

// ───── Admin Routes ─────
router.get("/", authMiddleware, authorizeRoles("admin"), getAllWithdrawalRequests);
router.get("/:id", authMiddleware, authorizeRoles("admin"), getWithdrawalRequestById);
router.post("/:withdrawalId/approve", authMiddleware, authorizeRoles("admin"), approveWithdrawal);
router.post("/:withdrawalId/reject", authMiddleware, authorizeRoles("admin"), rejectWithdrawal);

export default router;
