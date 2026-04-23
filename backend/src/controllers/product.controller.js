import prisma from "../lib/prisma.js";
import linkOrderItemsToProductsService from "../lib/linkService.js";
import { errorResponse, successResponse } from "../utils/respones.js";

//! link order items to products
export const linkOrderItemsToProductsController = async (req, res) => {
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

    const result = await linkOrderItemsToProductsService(storeId);

    return successResponse(res, 200, "Order items linked to products successfully", result);
  } catch (err) {
    return errorResponse(res, 500, "Failed to link order items to products", err.message);
  }
};

//! get Products

//! get Product by ID
