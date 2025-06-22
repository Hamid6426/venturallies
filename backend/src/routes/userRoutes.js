import express from "express";
import getAllUsers from "../controllers/user/getAllUsers.js";
import updateUser from "../controllers/user/updateUser.js";
import deleteUser from "../controllers/user/deleteUser.js";
import getUserById from "../controllers/user/getUserById.js";
import authMiddleware from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.patch("/", authMiddleware, updateUser);
router.delete("/", authMiddleware, deleteUser);
router.get("/:id", authMiddleware, getUserById);

export default router;
