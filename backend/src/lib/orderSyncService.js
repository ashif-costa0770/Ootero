// src/lib/syncService.js
import createWooClient from "./woocommerce.js";
import prisma from "./prisma.js";

//!sync orders
export const syncOrders = async (store) => {
  const woo = createWooClient(store);

  let page = 1;
  let totalSynced = 0;
  let totalFailed = 0;

  // 🔹 Product map (for linking)
  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    select: { id: true, wooProductId: true },
  });

  const productIdByWooId = new Map(products.map((p) => [p.wooProductId, p.id]));

  // 🔹 Track latest order date (this run only)
  let latestOrderDate = null;

  const isFirstSync = !store.lastOrderSyncAt;

  while (true) {
    let orders;

    const params = {
      per_page: 50,
      page,
      orderby: "date",
      order: "desc",
    };

    // 🔥 Incremental sync
    if (!isFirstSync && store.lastOrderSyncAt) {
      const afterDate = new Date(store.lastOrderSyncAt);
      afterDate.setSeconds(afterDate.getSeconds() + 1); // 👈 important

      params.after = afterDate.toISOString();
    }

    try {
      const response = await woo.get("/orders", { params });
      orders = response.data;
    } catch (err) {
      console.error(`[SYNC] Failed to fetch page ${page}:`, err.message);
      break;
    }

    if (!orders || orders.length === 0) break;

    for (const o of orders) {
      try {
        const orderDate = new Date(o.date_created_gmt || o.date_created);

        // 🔥 LOCAL FILTER (prevents duplicate syncing)
        if (store.lastOrderSyncAt && orderDate <= store.lastOrderSyncAt) {
          continue;
        }

        // 🔹 Skip manually edited orders
        const existingOrder = await prisma.order.findUnique({
          where: {
            storeId_wooOrderId: {
              storeId: store.id,
              wooOrderId: o.id,
            },
          },
          select: { id: true, isManuallyEdited: true },
        });

        if (existingOrder?.isManuallyEdited) {
          continue;
        }

        const customerName =
          `${o.billing?.first_name || ""} ${o.billing?.last_name || ""}`.trim() ||
          "Guest";

        const shippingMethod = o.shipping_lines?.[0]?.method_title || null;

        // 🔹 Track latest order date
        if (!latestOrderDate || orderDate > latestOrderDate) {
          latestOrderDate = orderDate;
        }

        // 🔹 Upsert Order
        const savedOrder = await prisma.order.upsert({
          where: {
            storeId_wooOrderId: {
              storeId: store.id,
              wooOrderId: o.id,
            },
          },
          update: {
            status: o.status,
            currency: o.currency,
            currencySymbol: o.currency_symbol || "$",
            totalAmount: parseFloat(o.total || 0),
            shippingTotal: parseFloat(o.shipping_total || 0),
            taxTotal: parseFloat(o.total_tax || 0),
            totalDiscount: parseFloat(o.discount_total || 0),
            paymentMethod: o.payment_method || null,
            paymentMethodTitle: o.payment_method_title || null,
            shippingMethod,
            customerName,
            customerEmail: o.billing?.email || "",
            customerPhone: o.billing?.phone || null,
            // Billing
            billingFirstName: o.billing?.first_name || null,
            billingLastName: o.billing?.last_name || null,
            billingCompany: o.billing?.company || null,
            billingAddress1: o.billing?.address_1 || null,
            billingAddress2: o.billing?.address_2 || null,
            billingCity: o.billing?.city || null,
            billingState: o.billing?.state || null,
            billingPostcode: o.billing?.postcode || null,
            billingCountry: o.billing?.country || null,
            billingEmail: o.billing?.email || null,
            billingPhone: o.billing?.phone || null,
            // Shipping
            shippingFirstName: o.shipping?.first_name || null,
            shippingLastName: o.shipping?.last_name || null,
            shippingCompany: o.shipping?.company || null,
            shippingAddress1: o.shipping?.address_1 || null,
            shippingAddress2: o.shipping?.address_2 || null,
            shippingCity: o.shipping?.city || null,
            shippingState: o.shipping?.state || null,
            shippingPostcode: o.shipping?.postcode || null,
            shippingCountry: o.shipping?.country || null,
            shippingPhone: o.shipping?.phone || null,
            note: o.customer_note || null,
            needsProcessing: o.needs_processing || false,
            datePaid: o.date_paid ? new Date(o.date_paid) : null,
            dateCompleted: o.date_completed ? new Date(o.date_completed) : null,
            createdAt: new Date(o.date_created),
            syncedAt: new Date(),
          },
          create: {
            storeId: store.id,
            wooOrderId: o.id,
            orderNumber: String(o.number),
            status: o.status,
            fulfillmentStatus: "unfulfilled",
            needsProcessing: o.needs_processing || false,
            currency: o.currency,
            currencySymbol: o.currency_symbol || "$",
            totalAmount: parseFloat(o.total || 0),
            shippingTotal: parseFloat(o.shipping_total || 0),
            taxTotal: parseFloat(o.total_tax || 0),
            totalDiscount: parseFloat(o.discount_total || 0),
            paymentMethod: o.payment_method || null,
            paymentMethodTitle: o.payment_method_title || null,
            shippingMethod,
            customerName,
            customerEmail: o.billing?.email || "",
            customerPhone: o.billing?.phone || null,
            // Billing
            billingAddress1: o.billing?.address_1 || null,
            billingAddress2: o.billing?.address_2 || null,
            billingCity: o.billing?.city || null,
            billingState: o.billing?.state || null,
            billingPostcode: o.billing?.postcode || null,
            billingCountry: o.billing?.country || null,
            // Shipping
            shippingAddress1: o.shipping?.address_1 || null,
            shippingAddress2: o.shipping?.address_2 || null,
            shippingCity: o.shipping?.city || null,
            shippingState: o.shipping?.state || null,
            shippingPostcode: o.shipping?.postcode || null,
            shippingCountry: o.shipping?.country || null,
            note: o.customer_note || null,
            datePaid: o.date_paid ? new Date(o.date_paid) : null,
            dateCompleted: o.date_completed ? new Date(o.date_completed) : null,
            createdAt: new Date(o.date_created),
            syncedAt: new Date(),
          },
        });

        // 🔹 Sync Items
        await prisma.orderItem.deleteMany({
          where: { orderId: savedOrder.id },
        });

        if (o.line_items?.length > 0) {
          await prisma.orderItem.createMany({
            data: o.line_items.map((item) => ({
              orderId: savedOrder.id,
              wooProductId: item.product_id || null,
              productId: productIdByWooId.get(item.product_id) || null,
              name: item.name || "Unknown Product",
              quantity: item.quantity || 1,
              price: parseFloat(item.price || 0),
              subtotal: parseFloat(item.subtotal || 0),
            })),
          });
        }

        totalSynced++;
      } catch (err) {
        console.error(`[SYNC] Failed on order #${o.id}:`, err.message);
        totalFailed++;
      }
    }

    // console.log(`[SYNC] Page ${page} done — ${orders.length} orders processed`);

    if (orders.length < 50) break;
    page++;
  }

  // 🔥 Update last sync timestamp
  if (latestOrderDate) {
    await prisma.store.update({
      where: { id: store.id },
      data: {
        lastOrderSyncAt: latestOrderDate,
      },
    });
  }

  console.log(
    `[SYNC] Finished. Synced: ${totalSynced} | Failed: ${totalFailed}`,
  );

  return {
    totalSynced,
    totalFailed,
    syncType: isFirstSync ? "full" : "incremental",
  };
};

//!force sync orders
export const forceOrderSync = async (store, filters) => {
  const woo = createWooClient(store);

  let page = 1;
  let totalSynced = 0;
  let totalFailed = 0;

  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    select: {
      id: true,
      wooProductId: true,
    },
  });

  // Create Map: wooProductId → product.id
  const productIdByWooId = new Map();

  for (const p of products) {
    productIdByWooId.set(p.wooProductId, p.id);
  }

  while (true) {
    let orders;

    const params = {
      per_page: 50,
      page,
      orderby: "date",
      order: "desc",
    };

    //add filters
    if (filters.fromDate) {
      params.after = new Date(filters.fromDate).toISOString();
    }
    if (filters.toDate) {
      params.before = new Date(filters.toDate).toISOString();
    }
    if (filters.status) {
      params.status = filters.status;
    }
    if (filters.orderIds && filters.orderIds.length > 0) {
      params.include = filters.orderIds.join(",");
    }

    try {
      const response = await woo.get("/orders", { params });
      orders = response.data;
    } catch (err) {
      console.error(`[FORCE SYNC] Failed to fetch page ${page}:`, err.message);
      break;
    }

    if (!orders || orders.length === 0) break;

    for (const o of orders) {
      try {
        // ── Check local order lock (manual edits) ──────
        const existingOrder = await prisma.order.findUnique({
          where: {
            storeId_wooOrderId: {
              storeId: store.id,
              wooOrderId: o.id,
            },
          },
          select: { id: true, isManuallyEdited: true },
        });

        if (existingOrder?.isManuallyEdited) {
          continue;
        }
        // ── Customer name ──────────────────────────────
        const customerName =
          `${o.billing?.first_name || ""} ${o.billing?.last_name || ""}`.trim() ||
          "Guest";

        // ── Shipping method title ──────────────────────
        const shippingMethod = o.shipping_lines?.[0]?.method_title || null;

        // ── Upsert Order ───────────────────────────────
        const savedOrder = await prisma.order.upsert({
          where: {
            storeId_wooOrderId: {
              storeId: store.id,
              wooOrderId: o.id,
            },
          },
          update: {
            status: o.status,
            currency: o.currency,
            currencySymbol: o.currency_symbol || "$",
            totalAmount: parseFloat(o.total || 0),
            shippingTotal: parseFloat(o.shipping_total || 0),
            taxTotal: parseFloat(o.total_tax || 0),
            totalDiscount: parseFloat(o.discount_total || 0),
            paymentMethod: o.payment_method || null,
            paymentMethodTitle: o.payment_method_title || null,
            shippingMethod,
            customerName,
            customerEmail: o.billing?.email || "",
            customerPhone: o.billing?.phone || null,
            // Billing
            billingFirstName: o.billing?.first_name || null,
            billingLastName: o.billing?.last_name || null,
            billingCompany: o.billing?.company || null,
            billingAddress1: o.billing?.address_1 || null,
            billingAddress2: o.billing?.address_2 || null,
            billingCity: o.billing?.city || null,
            billingState: o.billing?.state || null,
            billingPostcode: o.billing?.postcode || null,
            billingCountry: o.billing?.country || null,
            billingEmail: o.billing?.email || null,
            billingPhone: o.billing?.phone || null,
            // Shipping
            shippingFirstName: o.shipping?.first_name || null,
            shippingLastName: o.shipping?.last_name || null,
            shippingCompany: o.shipping?.company || null,
            shippingAddress1: o.shipping?.address_1 || null,
            shippingAddress2: o.shipping?.address_2 || null,
            shippingCity: o.shipping?.city || null,
            shippingState: o.shipping?.state || null,
            shippingPostcode: o.shipping?.postcode || null,
            shippingCountry: o.shipping?.country || null,
            shippingPhone: o.shipping?.phone || null,
            note: o.customer_note || null,
            needsProcessing: o.needs_processing || false,
            datePaid: o.date_paid ? new Date(o.date_paid) : null,
            dateCompleted: o.date_completed ? new Date(o.date_completed) : null,
            createdAt: new Date(o.date_created),
            syncedAt: new Date(),
          },
          create: {
            storeId: store.id,
            wooOrderId: o.id,
            orderNumber: String(o.number),
            status: o.status,
            fulfillmentStatus: "unfulfilled",
            needsProcessing: o.needs_processing || false,
            currency: o.currency,
            currencySymbol: o.currency_symbol || "$",
            totalAmount: parseFloat(o.total || 0),
            shippingTotal: parseFloat(o.shipping_total || 0),
            taxTotal: parseFloat(o.total_tax || 0),
            totalDiscount: parseFloat(o.discount_total || 0),
            paymentMethod: o.payment_method || null,
            paymentMethodTitle: o.payment_method_title || null,
            shippingMethod,
            customerName,
            customerEmail: o.billing?.email || "",
            customerPhone: o.billing?.phone || null,
            // Billing
            billingAddress1: o.billing?.address_1 || null,
            billingAddress2: o.billing?.address_2 || null,
            billingCity: o.billing?.city || null,
            billingState: o.billing?.state || null,
            billingPostcode: o.billing?.postcode || null,
            billingCountry: o.billing?.country || null,
            // Shipping
            shippingAddress1: o.shipping?.address_1 || null,
            shippingAddress2: o.shipping?.address_2 || null,
            shippingCity: o.shipping?.city || null,
            shippingState: o.shipping?.state || null,
            shippingPostcode: o.shipping?.postcode || null,
            shippingCountry: o.shipping?.country || null,
            note: o.customer_note || null,
            datePaid: o.date_paid ? new Date(o.date_paid) : null,
            dateCompleted: o.date_completed ? new Date(o.date_completed) : null,
            createdAt: new Date(o.date_created),
            syncedAt: new Date(),
          },
        });

        // ── Sync Order Items ───────────────────────────
        // Delete old items first, then re-insert fresh
        // This handles item edits/deletions on WooCommerce side
        await prisma.orderItem.deleteMany({
          where: { orderId: savedOrder.id },
        });

        if (o.line_items?.length > 0) {
          await prisma.orderItem.createMany({
            data: o.line_items.map((item) => ({
              orderId: savedOrder.id,
              wooProductId: item.product_id || null,
              productId: productIdByWooId.get(item.product_id) || null,
              name: item.name || "Unknown Product",
              sku: item.sku || null,
              quantity: item.quantity || 1,
              price: parseFloat(item.price || 0),
              subtotal: parseFloat(item.subtotal || 0),
              imageUrl: item.image?.src || null,
            })),
          });
        }

        totalSynced++;
      } catch (err) {
        console.error(`[FORCE SYNC] Failed on order #${o.id}:`, err.message);
        totalFailed++;
      }
    }

    console.log(
      `[FORCE SYNC] Page ${page} done — ${orders.length} orders processed`,
    );

    // If less than 100 returned, this was the last page
    if (orders.length < 50) break;
    page++;
  }

  console.log(
    `[FORCE SYNC] Finished. Synced: ${totalSynced} | Failed: ${totalFailed}`,
  );

  return {
    totalSynced,
    totalFailed,
  };
};
