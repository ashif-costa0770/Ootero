import express from "express";

const router = express.Router();

import { triggerOrderSync, forceTriggerOrderSync, triggerProductSync, toggleOrderAutoSync } from "../controllers/sync.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

router.post("/:storeId/orders", protect, triggerOrderSync);
router.post("/:storeId/orders/force", protect, forceTriggerOrderSync);
router.post("/:storeId/products", protect, triggerProductSync);

//! enable/disable order auto sync
router.patch("/:storeId/orders/auto-sync/toggle", protect, toggleOrderAutoSync);

export default router;