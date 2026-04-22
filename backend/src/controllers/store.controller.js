import prisma from "../lib/prisma.js";
import createWooClient from "../lib/woocommerce.js";
import { encrypt } from "../utils/encryption.js";
import { errorResponse, successResponse } from "../utils/respones.js";
import { verifyWooCommerce } from "../utils/verifyPlatform.js";

//! connect Store
export const connectStore = async (req, res) => {
  const { name, platform, storeUrl, consumerKey, consumerSecret } = req.body;

  const userId = req.user.id;

  try {
    // Check if store already exists
    const existingStore = await prisma.store.findFirst({
      where: {
        storeUrl: storeUrl,
        userId: userId,
      },
    });

    if (existingStore) {
      return errorResponse(res, 400, "Store already connected");
    }

    // 1. Verify credentials
    let isValid = false;

    if (platform === "woocommerce") {
      isValid = await verifyWooCommerce({
        url: storeUrl,
        key: consumerKey,
        secret: consumerSecret,
      });
    }

    if (!isValid) {
      return errorResponse(res, 400, "Invalid store credentials");
    }

    // 2. Encrypt sensitive data
    const encryptedKey = encrypt(consumerKey);
    const encryptedSecret = encrypt(consumerSecret);

    // 3. Save to DB
    const store = await prisma.store.create({
      data: {
        userId,
        name,
        platform,
        storeUrl,
        consumerKey: encryptedKey,
        consumerSecret: encryptedSecret,
      },
    });

    // const { consumerKey, consumerSecret, ...safeStore } = store;
    return successResponse(res, 201, "Store connected successfully", store);
  } catch (error) {
    return errorResponse(res, 500, "Error in connecting store", error.message);
  }
};

//! get Store details
export const getStoreDetails = async (req, res) => {
  const storeId = parseInt(req.params.storeId);

  try {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    const client = createWooClient(store);

    // 2. Fetch all stats in parallel from WooCommerce
    const [
      ordersRes,
      productsRes,
      customersRes,
      pendingRes,
      processingRes,
      completedRes,
      cancelledRes,
      onHoldRes,
    ] = await Promise.all([
      client.get("/reports/orders/totals"), // order status breakdown
      client.get("/products", { params: { per_page: 1 } }), // just for total count header
      client.get("/customers", { params: { per_page: 1 } }), // just for total count header
      client.get("/orders", { params: { status: "pending", per_page: 1 } }),
      client.get("/orders", { params: { status: "processing", per_page: 1 } }),
      client.get("/orders", { params: { status: "completed", per_page: 1 } }),
      client.get("/orders", { params: { status: "cancelled", per_page: 1 } }),
      client.get("/orders", { params: { status: "on-hold", per_page: 1 } }),
    ]);

    // 3. WooCommerce returns total count in response headers
    const totalProducts = parseInt(productsRes.headers["x-wp-total"] || 0);
    const totalCustomers = parseInt(customersRes.headers["x-wp-total"] || 0);
    const totalPending = parseInt(pendingRes.headers["x-wp-total"] || 0);
    const totalProcessing = parseInt(processingRes.headers["x-wp-total"] || 0);
    const totalCompleted = parseInt(completedRes.headers["x-wp-total"] || 0);
    const totalCancelled = parseInt(cancelledRes.headers["x-wp-total"] || 0);
    const totalOnHold = parseInt(onHoldRes.headers["x-wp-total"] || 0);

    // 4. Sum total orders from the breakdown
    const orderTotals = ordersRes.data; // [{ slug: 'pending', name: 'Pending', total: '3' }, ...]
    const totalOrders = orderTotals.reduce(
      (sum, s) => sum + parseInt(s.total),
      0,
    );

     // 5. Get revenue from sales report
     let totalRevenue = "0.00";
     try {
       const salesRes = await client.get("/reports/sales", {
         params: {
           date_min: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
             .toISOString()
             .split("T")[0],
           date_max: new Date().toISOString().split("T")[0],
         },
       });
       totalRevenue = salesRes.data?.total_sales || "0.00";
     } catch (_) {
       // sales report may not always be available

     }

    return successResponse(res, 200, "Store details fetched successfully", {
      store: {
        id: store.id,
        name: store.name,
        url: store.storeUrl,
        platform: store.platform,
        connectedAt: store.createdAt,
      },
      stats: {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalRevenue,
        ordersByStatus: {
          pending: totalPending,
          processing: totalProcessing,
          onHold: totalOnHold,
          completed: totalCompleted,
          cancelled: totalCancelled,
         
        },
       
      },
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in getting store details",
      error.message,
    );
  }
};
