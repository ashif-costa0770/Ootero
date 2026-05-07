import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import validate from "../middlewares/validate.js";
import { updateUserSchema, changePasswordSchema } from "../validations/user.validation.js";

const router = express.Router();

router.get("/:userId", protect, getUserProfile);
router.put(
  "/:userId",
  protect,
  upload.single("profileImage"),
  validate(updateUserSchema),
  updateUserProfile,
);

router.put("/:userId/change-password", protect, validate(changePasswordSchema), changePassword);

export default router;
