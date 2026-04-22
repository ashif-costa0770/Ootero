import prisma from "../lib/prisma.js";
import syncOrders from "../lib/syncService.js";
import { errorResponse, successResponse } from "../utils/respones.js";

// POST /api/sync/:storeId
export const triggerSync = async (req, res) => {
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

    return successResponse(res, 200, "Order sync completed", {
      totalSynced: result.totalSynced,
      totalFailed: result.totalFailed,
    });
  } catch (err) {
    return errorResponse(res, 500, "Error in triggering sync", err.message);
  }
};