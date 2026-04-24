import prisma from "./prisma.js";

const linkOrderItemsToProductsService = async (storeId) => {
  let totalLinked = 0;

  // Get all products for this store
  const products = await prisma.product.findMany({
    where: { storeId },
    select: {
      id: true,
      wooProductId: true,
    },
  });

  for (const product of products) {
    const result = await prisma.orderItem.updateMany({
      where: {
        wooProductId: product.wooProductId,
        productId: null,
        order: {
          storeId,
        },
      },
      data: {
        productId: product.id,
      },
    });

    totalLinked += result.count;
  }

  console.log(`[LINK] Total linked: ${totalLinked}`);

  return { totalLinked };
};

export default linkOrderItemsToProductsService;