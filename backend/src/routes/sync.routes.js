import express from "express";

const router = express.Router();

import { triggerSync } from "../controllers/sync.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

router.post("/:storeId", protect, triggerSync);

export default router;