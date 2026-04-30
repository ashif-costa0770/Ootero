import prisma from "../lib/prisma.js";
import { syncOrders, forceOrderSync } from "../lib/orderSyncService.js";
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

    const result = await syncOrders(store);
    const message =
      result.syncType === "full"
        ? "Full order sync completed"
        : "New orders synced successfully";

    return successResponse(res, 200, message, {
      totalSynced: result.totalSynced,
      totalFailed: result.totalFailed,
      syncType: result.syncType,
    });
  } catch (err) {
    return errorResponse(res, 500, "Error in triggering sync", err.message);
  }
};

//!force sync orders
export const forceTriggerOrderSync = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;
    const { orderIds, status, fromDate, toDate } = req.body;

    if (!orderIds && !status && !fromDate && !toDate) {
      return errorResponse(res, 400, "At least one filter is required");
    }

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    //force sync service
    const result = await forceOrderSync(store, {
      orderIds,
      status,
      fromDate,
      toDate,
    });

    return successResponse(
      res,
      200,
      `${result.totalSynced} orders force synced successfully`,
      {
        totalSynced: result.totalSynced,
        totalFailed: result.totalFailed,
      },
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in forcing order sync",
      error.message,
    );
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
    return errorResponse(
      res,
      500,
      "Error in triggering product sync",
      err.message,
    );
  }
};

//! enable/disable order auto sync
export const toggleOrderAutoSync = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;
    const  enabled  = req.body.enabled;

    if (typeof enabled !== "boolean") {
      return errorResponse(res, 400, "Enabled must be a boolean", "Invalid request body");
    }

    //find the store
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    //update the store
    await prisma.store.update({
      where: { id: storeId },
      data: { orderAutoSyncEnabled: enabled },
    });

    return successResponse(
      res,
      200,
      enabled
        ? "Order auto-sync resumed for this store"
        : "Order auto-sync paused for this store",
    );

  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in toggling order auto sync",
      error.message,
    );
  }
};
