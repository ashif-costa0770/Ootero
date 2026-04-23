import express from "express";
import { getOrders, getOrderById } from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:storeId", protect, getOrders);
router.get("/:storeId/:orderId", protect, getOrderById);

export default router;