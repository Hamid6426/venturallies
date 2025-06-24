import express from "express";
import authMiddleware from "../middleware/isAuthenticated.js";
import createInvestment from "../controllers/investment/createInvestment.js";
import getMyInvestments from "../controllers/investment/getMyInvestments.js";
import getMyInvestmentById from "../controllers/investment/getMyInvestmentById.js";
import cancelInvestment from "../controllers/investment/cancelInvestment.js";
import getAllInvestments from "../controllers/investment/getAllInvestments.js";
import getInvestmentByIdForAdmin from "../controllers/investment/getInvestmentByIdAdmin.js";
import softDeleteInvestment from "../controllers/investment/softDeleteInvestment.js";
import getInvestmentsByVenture from "../controllers/investment/getInvestmentsByVenture.js";

const router = express.Router();

// Authenticated User
router.post("/", authMiddleware, createInvestment);
router.get("/my-investments", authMiddleware, getMyInvestments);
router.get("/admin", authMiddleware, getAllInvestments);
router.get("/:id", authMiddleware, getMyInvestmentById);
router.delete("/:id", authMiddleware, cancelInvestment);

router.get("/", authMiddleware, getAllInvestments);
router.get("/:id", authMiddleware, getInvestmentByIdForAdmin);
router.delete("/:id", authMiddleware, softDeleteInvestment);

// Nested route for venture investments
router.get("/venture/:ventureId", authMiddleware, getInvestmentsByVenture);

export default router;
