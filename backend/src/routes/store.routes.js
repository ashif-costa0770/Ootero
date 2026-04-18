import express from "express";
import { connectStore } from "../controllers/store.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.js";
import { connectStoreSchema } from "../validations/store.validation.js";


const router = express.Router();

router.post("/connect", protect, validate(connectStoreSchema), connectStore);

export default router;