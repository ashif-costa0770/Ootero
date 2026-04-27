import prisma from "../lib/prisma.js";

export const removeOrderItemService = async ({
  orderId,
  orderItemId,
  userId,
}) => {
  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Find item
    const item = await tx.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: {
          include: {
            store: true,
          },
        },
      },
    });

    if (!item) {
      const err = new Error("Order item not found");
      err.statusCode = 404;
      throw err;
    }

    // 2️⃣ Validate ownership (security)
    if (item.order.id !== orderId) {
      const err = new Error("Invalid order item for this order");
      err.statusCode = 400;
      throw err;
    }

    if (item.order.store.userId !== userId) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    // 3️⃣ Count items
    const itemCount = await tx.orderItem.count({
      where: { orderId },
    });

    // 4️⃣ Prevent last item delete
    if (itemCount === 1) {
      const err = new Error("Cannot remove last item from order");
      err.statusCode = 400;
      throw err;
    }

    // 5️⃣ Delete item
    await tx.orderItem.delete({
      where: { id: orderItemId },
    });

    // 6️⃣ Mark order as manually edited
    await tx.order.update({
      where: { id: orderId },
      data: {
        isManuallyEdited: true,
      },
    });

    return { success: true };
  });
};

//! update shipping address
export const updateShippingAddressService = async ({ orderId, userId, data }) => {
 return await prisma.$transaction(async (tx) => {

    // 1️⃣ Find order
    const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
            store: true,
        },
    })

    if (!order) {
        const err = new Error("Order not found");
        err.statusCode = 404;
        throw err;
    }

    // 2️⃣ Validate ownership (security)
    if (order.store.userId !== userId) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        throw err;
    }

    // 3️⃣ Update shipping address
    const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {...data, isManuallyEdited: true}
    })

    return { success: true, data: updatedOrder };
 })
};