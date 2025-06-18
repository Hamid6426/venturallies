import express from "express";
import getProfile from "../controllers/profile/getProfile.js";
import updateProfile from "../controllers/profile/updateProfile.js";
import authMiddleware from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/get", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);

export default router;
