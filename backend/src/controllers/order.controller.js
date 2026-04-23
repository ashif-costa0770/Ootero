import prisma from "../lib/prisma.js";
import { successResponse, errorResponse } from "../utils/respones.js";

//! get Orders

export const getOrders = async (req, res) => {
  const storeId = parseInt(req.params.storeId);
  const userId = req.user.id;
  const { page = 1, limit = 20, status, search } = req.query;
  const skip = (page - 1) * limit;

  try {
    // validate storeId
    if (isNaN(storeId)) {
      return errorResponse(res, 400, "Invalid store ID");
    }

    // Find store
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId: userId,
      },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    //Where clause

    const where = {
      storeId,

      ...(status && { status }),

      ...(search && {
        OR: [
          { orderNumber: { contains: search } },
          { customerName: { contains: search } },
          { customerEmail: { contains: search } },
        ],
      }),
    };

    //fetch orders
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          currency: true,
          customerName: true,
          customerEmail: true,
          createdAt: true,
        },
      }),
      prisma.order.count({
        where,
      }),
    ]);

    // Pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return successResponse(res, 200, "Orders fetched successfully", {
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Error in getting orders", error.message);
  }
};

//! get Order by ID
export const getOrderById = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;

    // validate storeId
    if (isNaN(storeId)) {
      return errorResponse(res, 400, "Invalid store ID");
    }

    // Find store
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      }
    })

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    // Find order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        storeId,
      },
      include: {
        items: true,
      }
    })

    if (!order) {
      return errorResponse(res, 404, "Order not found");
    }

    return successResponse(res, 200, "Order fetched successfully", order);
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in getting order by ID",
      error.message,
    );
  }
};
