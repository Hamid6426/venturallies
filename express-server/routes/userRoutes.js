import express from 'express';
import getAllUsers from '../controllers/userControllers/getAllUsers.js';

const router = express.Router();

// GET /api/users — get all users
router.get('/', getAllUsers);

// Add more routes here as needed

export default router;
