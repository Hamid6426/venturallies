import express from "express";
import getAllUsers from "../controllers/userControllers/getAllUsers.js";

const router = express.Router();

router.get("/", getAllUsers);

export default router;
