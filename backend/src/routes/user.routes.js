import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import validate from "../middlewares/validate.js";
import { updateUserSchema } from "../validations/user.validation.js";

const router = express.Router();

router.get("/:userId", protect, getUserProfile);
router.put("/:userId", protect, validate(updateUserSchema), upload.single("profileImage"), updateUserProfile);

export default router;