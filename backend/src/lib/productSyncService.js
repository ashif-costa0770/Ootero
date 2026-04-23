import createWooClient from "./woocommerce.js";
import prisma from "./prisma.js";

const productSyncService = async (store) => {
  const woo = createWooClient(store);

  let page = 1;
  let totalSynced = 0;
  let totalFailed = 0;

  while (true) {
    let products;

    try {
      const res = await woo.get("/products", {
        params: {
          per_page: 50,
          page,
        },
      });

      products = res.data;
    } catch (err) {
      console.error(`[PRODUCT SYNC] Page ${page} failed:`, err.message);
      break;
    }

    if (!products || products.length === 0) break;

    for (const p of products) {
      try {
        await prisma.product.upsert({
          where: {
            storeId_wooProductId: {
              storeId: store.id,
              wooProductId: p.id,
            },
          },

          update: {
            name: p.name,
            slug: p.slug,
            permalink: p.permalink,
            type: p.type,
            status: p.status,

            price: parseFloat(p.price || 0),
            regularPrice: parseFloat(p.regular_price || 0),
            salePrice: parseFloat(p.sale_price || 0),
            onSale: p.on_sale,

            sku: p.sku,
            manageStock: p.manage_stock,
            stockQuantity: p.stock_quantity,
            stockStatus: p.stock_status,

            weight: p.weight ? parseFloat(p.weight) : null,
            dimensions: p.dimensions || null,

            categories: p.categories || [],
            images: p.images || [],
            attributes: p.attributes || [],

            syncedAt: new Date(),
          },

          create: {
            storeId: store.id,
            wooProductId: p.id,

            name: p.name,
            slug: p.slug,
            permalink: p.permalink,
            type: p.type,
            status: p.status,

            price: parseFloat(p.price || 0),
            regularPrice: parseFloat(p.regular_price || 0),
            salePrice: parseFloat(p.sale_price || 0),
            onSale: p.on_sale,

            sku: p.sku,
            manageStock: p.manage_stock,
            stockQuantity: p.stock_quantity,
            stockStatus: p.stock_status,

            weight: p.weight ? parseFloat(p.weight) : null,
            dimensions: p.dimensions || null,

            categories: p.categories || [],
            images: p.images || [],
            attributes: p.attributes || [],

            createdAt: new Date(),
          },
        });

        totalSynced++;
      } catch (err) {
        console.error(`[PRODUCT SYNC] Product ${p.id} failed:`, err.message);
        totalFailed++;
      }
    }

    console.log(`[PRODUCT SYNC] Page ${page} done`);

    page++;
  }

  return { totalSynced, totalFailed };
};

export default productSyncService;