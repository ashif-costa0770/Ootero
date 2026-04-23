import prisma from "../lib/prisma.js";
import orderSyncService from "../lib/orderSyncService.js";
import productSyncService from "../lib/productSyncService.js";
import { errorResponse, successResponse } from "../utils/respones.js";

//! sync orders
export const triggerOrderSync = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);

    if (isNaN(storeId)) {
      return errorResponse(res, 400, "Invalid store ID");
    }

    const store = await prisma.store.findFirst({
      where: { id: storeId, userId: req.user.id },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    const result = await orderSyncService(store);

    return successResponse(res, 200, "Order sync completed", {
      totalSynced: result.totalSynced,
      totalFailed: result.totalFailed,
    });
  } catch (err) {
    return errorResponse(res, 500, "Error in triggering sync", err.message);
  }
};

//! sync products
export const triggerProductSync = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.storeId);

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    const result = await productSyncService(store);

    return successResponse(res, 200, "Product sync completed", {
      totalSynced: result.totalSynced,
      totalFailed: result.totalFailed,
    });
  } catch (err) {
    return errorResponse(res, 500, "Error in triggering product sync", err.message);
  }
};