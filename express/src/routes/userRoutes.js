import express from "express";
import getAllUsers from "../controllers/userControllers/getAllUsers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
// Optionally import other user-related controllers here

const router = express.Router();

// GET /api/users?role=&status=&search=&page=&limit=
router.get("/", authMiddleware, getAllUsers);

// Placeholder for more routes (e.g. getSingleUser, updateUser, deleteUser)
export default router;
