import express from "express";
import { linkOrderItemsToProductsController } from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:storeId/link-order-items-to-products", protect, linkOrderItemsToProductsController);

export default router;