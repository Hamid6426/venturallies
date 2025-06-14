import express from "express";
import createVenture from "../controllers/ventureControllers/createVenture.js";
import getAllVentures from "../controllers/ventureControllers/getAllVentures.js";
import getVentureById from "../controllers/ventureControllers/getVentureById.js";
import getVentureBySlug from "../controllers/ventureControllers/getVentureBySlug.js";
import updateVenture from "../controllers/ventureControllers/updateVenture.js";
import patchVentureImage from "../controllers/ventureControllers/patchVentureImage.js";
import getMyVentures from "../controllers/ventureControllers/getMyVentures.js";
import deleteVentureImage from "../controllers/ventureControllers/deleteVentureImage.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { uploadVentureImages } from "../middlewares/uploadMiddleware.js";

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

export default router;
