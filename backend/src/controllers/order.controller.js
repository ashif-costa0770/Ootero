import prisma from "../lib/prisma.js";
import { removeOrderItemService } from "../services/order.service.js";
import { successResponse, errorResponse } from "../utils/respones.js";
import { updateShippingAddressService } from "../services/order.service.js";

//! get Orders

export const getOrders = async (req, res) => {
  const storeId = parseInt(req.params.storeId);
  const userId = req.user.id;
  const { page = 1, limit = 10, status, search } = req.query;
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

    const summaryWhere = {
      storeId,
      ...(search && {
        OR: [
          { orderNumber: { contains: search } },
          { customerName: { contains: search } },
          { customerEmail: { contains: search } },
        ],
      }),
    };

    //fetch orders
    const [orders, total, statusRows] = await Promise.all([
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
          customerPhone: true,
          billingAddress1: true,
          shippingAddress1: true,
          shippingAddress2: true,
          shippingCity: true,
          shippingState: true,
          shippingPostcode: true,
          shippingCountry: true,
          shippingPhone: true,                                      
          shippingMethod: true,
          shippingTotal: true,
          createdAt: true,
          items: {
            select: {
              id: true,
              productId: true,
              name: true,
              sku: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  dimensions: true,
                  weight: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({
        where,
      }),
      prisma.order.groupBy({
        by: ["status"],
        where: summaryWhere,
        _count: {
          status: true,
        },
      }),
    ]);

    // Calculate counts for each status
    const statusCounts = statusRows.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {});

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
      statusCounts,
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
      },
    });

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
      },
    });

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

//! remove Order Item
export const removeOrderItemController = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);
    const orderItemId = parseInt(req.params.orderItemId);

    //call service
    const result = await removeOrderItemService({
      orderId,
      orderItemId,
      userId,
    });

    return successResponse(res, 200, "Order item removed successfully", result);
  } catch (error) {
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Error in removing order item"
    );
  }
};


//! update order
export const updateShippingAddressController = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);

    //service
    const result = await updateShippingAddressService({
      orderId,
      userId,
      data: req.body
    })

    return successResponse(res, 200, "Shipping address updated successfully", result);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message || "Error in updating order");
    
  }
}