import express from "express";
import createVenture from "../controllers/venture/createVenture.js";
import getAllVentures from "../controllers/venture/getAllVentures.js";
import getVentureById from "../controllers/venture/getVentureById.js";
import getVentureBySlug from "../controllers/venture/getVentureBySlug.js";
import updateVenture from "../controllers/venture/updateVenture.js";
import patchVentureImage from "../controllers/venture/patchVentureImage.js";
import getMyVentures from "../controllers/venture/getMyVentures.js";
import deleteVentureImage from "../controllers/venture/deleteVentureImage.js";

import authMiddleware from "../middleware/isAuthenticated.js";
import { uploadVentureImages } from "../middleware/imageUpload.js";
import updateAdminStatus from "../controllers/venture/updateAdminStatus.js";

const router = express.Router();

// Create Venture
router.post("/", authMiddleware, createVenture);

// My Ventures (must come BEFORE any wildcard/dynamic routes)
router.get("/my-ventures", authMiddleware, getMyVentures);

// All ventures (no auth)
router.get("/", getAllVentures);

// Upload image to a venture
router.patch(
  "/:ventureId/upload-image",
  authMiddleware,
  uploadVentureImages,
  patchVentureImage
);

// Delete image from a venture
router.patch("/:ventureId/delete-image", authMiddleware, deleteVentureImage);

// Update venture by ID
router.put("/:ventureId", authMiddleware, updateVenture);

// Get venture by ID (specific route for ObjectId)
router.get("/id/:ventureId", getVentureById);

// Get venture by slug (less specific - placed last)
router.get("/slug/:ventureSlug", getVentureBySlug);


router.patch("/admin-status", authMiddleware, updateAdminStatus);

export default router;
