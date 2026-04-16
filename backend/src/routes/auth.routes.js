import express from "express";
import { register, login, verifyEmail } from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/verify-email", verifyEmail);

export default router;