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
import ventureStatusUpdateByAdmin from "../controllers/venture/admin/adminStatusUpdate.js";

const router = express.Router();

router.post("/", authMiddleware, createVenture);
router.get("/", getAllVentures);
router.get("/my-ventures", authMiddleware, getMyVentures);

router.patch(
  "/:ventureId/upload-image",
  authMiddleware,
  uploadVentureImages,
  addVentureImage
);

router.patch("/id/:ventureId/delete-image", authMiddleware, deleteVentureImage);
router.put("/id/:ventureId", authMiddleware, ventureUpdateByUser);
router.put("/id/:ventureId", authMiddleware, ventureUpdateByAdmin);
router.get("/id/:ventureId", getVentureById);
router.get("/slug/:ventureSlug", getVentureBySlug);
router.patch("/admin-status", authMiddleware, ventureStatusUpdateByAdmin);

export default router;
