// routes/profileRoutes.js
import express from "express";
import getProfile from "../controllers/profileControllers/getProfile.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import updateProfile from "../controllers/profileControllers/updateProfile.js";
const router = express.Router();

router.get("/get", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);

export default router;
