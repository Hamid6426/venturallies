import express from "express";
import createVenture from "../controllers/ventureControllers/createVenture";
import getAllVentures from "../controllers/ventureControllers/getAllVentures";
import getVentureById from "../controllers/ventureControllers/getVentureById";
import getVentureBySlug from "../controllers/ventureControllers/getVentureBySlug";
import updateVenture from "../controllers/ventureControllers/updateVenture";

const router = express.Router();

// Create
router.post("/", createVenture);

// List (with filters + pagination)
router.get("/", getAllVentures);

// Get by MongoDB ID
router.get("/id/:id", getVentureById);

// Get by slug
router.get("/slug/:slug", getVentureBySlug);

// Update venture (admin only)
router.put("/id/:id", updateVenture);   

export default router;