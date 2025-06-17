import express from "express";
import registerUser from "../controllers/auth/registerUser.js";
import verifyEmail from "../controllers/auth/verifyEmail.js";
import resendVerificationToken from "../controllers/auth/resendVerificationToken.js";
import loginUser from "../controllers/auth/loginUser.js";
import forgotPassword from "../controllers/auth/forgotPassword.js";
import resetPassword from "../controllers/auth/resetPassword.js";
import logoutUser from "../controllers/auth/logoutUser.js";
import loginAdmin from "../controllers/auth/loginAdmin.js";

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
