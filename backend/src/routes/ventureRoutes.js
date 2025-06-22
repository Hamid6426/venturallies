import express from "express";
import createVenture from "../controllers/venture/createVenture.js";
import getAllVentures from "../controllers/venture/getAllVentures.js";
import getVentureById from "../controllers/venture/getVentureById.js";
import getVentureBySlug from "../controllers/venture/getVentureBySlug.js";
import ventureUpdateByUser from "../controllers/venture/ventureUpdateByUser.js";
import ventureUpdateByAdmin from "../controllers/venture/ventureUpdateByAdmin.js";
import addVentureImage from "../controllers/venture/addVentureImage.js";
import getMyVentures from "../controllers/venture/getMyVentures.js";
import deleteVentureImage from "../controllers/venture/deleteVentureImage.js";

import authMiddleware from "../middleware/isAuthenticated.js";
import { uploadVentureImages } from "../middleware/imageUpload.js";
import adminStatusUpdate from "../controllers/venture/adminStatusUpdate.js";
import adminGetAllVentures from "../controllers/venture/adminGetAllVentures.js";

const router = express.Router();

// By User only
router.post("/", authMiddleware, createVenture);
router.get("/admin-get-all", authMiddleware, adminGetAllVentures);

// add image to venture by current user
router.patch(
  "/id/:ventureId/upload-image",
  authMiddleware,
  uploadVentureImages,
  addVentureImage
);

// Public
router.get("/", getAllVentures);

// current user veutures
router.get("/my-ventures", authMiddleware, getMyVentures);

// delete image from venture by current user
router.patch("/:ventureId/delete-image", authMiddleware, deleteVentureImage);

// update of venture by current user
router.put("/:ventureId", authMiddleware, ventureUpdateByUser);

// fetch by id (due to dynamic route error /id is important)
router.get("/id/:ventureId", getVentureById);

// fetch by slug (due to dynamic route error /slug is important)
router.get("/slug/:ventureSlug", getVentureBySlug);

// update of venture by admin
router.put("/admin/:ventureId", authMiddleware, ventureUpdateByAdmin);

// admin update status
router.patch(
  "/admin/:ventureId/admin-status-update",
  authMiddleware,
  adminStatusUpdate
);

export default router;
