import express from "express";

const router = express.Router();

import { triggerOrderSync, triggerProductSync } from "../controllers/sync.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

router.post("/:storeId/orders", protect, triggerOrderSync);
router.post("/:storeId/products", protect, triggerProductSync);

export default router;