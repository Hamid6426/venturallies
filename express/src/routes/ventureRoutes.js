import express from "express";
import createVenture from "../controllers/venture/user/createVenture.js";
import getAllVentures from "../controllers/venture/getAllVentures.js";
import getVentureById from "../controllers/venture/getVentureById.js";
import getVentureBySlug from "../controllers/venture/getVentureBySlug.js";
import ventureUpdateByUser from "../controllers/venture/user/ventureUpdateByUser.js";
import ventureUpdateByAdmin from "../controllers/venture/admin/ventureUpdateByAdmin.js";
import addVentureImage from "../controllers/venture/user/addVentureImage.js";
import getMyVentures from "../controllers/venture/user/getMyVentures.js";
import deleteVentureImage from "../controllers/venture/user/deleteVentureImage.js";

import authMiddleware from "../middleware/isAuthenticated.js";
import { uploadVentureImages } from "../middleware/imageUpload.js";
import adminStatusUpdate from "../controllers/venture/admin/adminStatusUpdate.js";

const router = express.Router();

// By User only
router.post("/", authMiddleware, createVenture);

// Public
router.get("/", getAllVentures);

// current user veutures
router.get("/my-ventures", authMiddleware, getMyVentures);

// add image to venture by current user
router.patch(
  "/:ventureId/upload-image",
  authMiddleware,
  uploadVentureImages,
  addVentureImage
);

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
