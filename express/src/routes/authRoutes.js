import express from "express";
import registerUser from "../controllers/authControllers/registerUser.js";
import verifyEmail from "../controllers/authControllers/verifyEmail.js";
import resendVerificationToken from "../controllers/authControllers/resendVerificationToken.js";
import loginUser from "../controllers/authControllers/loginUser.js";
import forgotPassword from "../controllers/authControllers/forgotPassword.js";
import resetPassword from "../controllers/authControllers/resetPassword.js";
import logoutUser from "../controllers/authControllers/logoutUser.js";
import loginAdmin from "../controllers/authControllers/loginAdmin.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-token", resendVerificationToken);
router.post("/login", loginUser);
router.post("/login-admin", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logoutUser);

export default router;
