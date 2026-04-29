import express from "express";
import {
  getOrders,
  getOrderById,
  removeOrderItemController,
  updateShippingAddressController,
  updatePackageInfoController,
  changeOrderStatusController,
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { updateShippingSchema } from "../validations/order.validation.js";
import validate from "../middlewares/validate.js";
import {
  updatePackageInfoSchema,
  changeOrderStatusSchema,
} from "../validations/order.validation.js";

const router = express.Router();

router.get("/:storeId", protect, getOrders);
router.get("/:storeId/:orderId", protect, getOrderById);
router.delete("/:orderId/items/:orderItemId", protect, removeOrderItemController);
router.put("/:orderId/shipping", protect, validate(updateShippingSchema), updateShippingAddressController);
router.put("/:orderId/package", protect, validate(updatePackageInfoSchema), updatePackageInfoController);
router.put(
  "/bulk/status",
  protect,
  validate(changeOrderStatusSchema),
  changeOrderStatusController,
);

export default router;