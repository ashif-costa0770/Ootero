import express from "express";
import { register, login, verifyEmail, forgotPassword, resetPassword, getProfile, logout } from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.js";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/auth.validation.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/verify-email", verifyEmail);
router.get("/me", protect, getProfile)
router.post("/logout", protect, logout);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;