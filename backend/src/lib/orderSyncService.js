// src/lib/syncService.js
import createWooClient from "./woocommerce.js";
import prisma from "./prisma.js";

const syncOrders = async (store) => {
  const woo = createWooClient(store);
  let page = 1;
  let totalSynced = 0;
  let totalFailed = 0;

  while (true) {
    let orders;

    try {
      const response = await woo.get("/orders", {
        params: {
          per_page: 50,
          page,
          orderby: "date",
          order: "desc",
        },
      });
      orders = response.data;
    } catch (err) {
      console.error(`[SYNC] Failed to fetch page ${page}:`, err.message);
      break;
    }

    // No more orders — stop loop
    if (!orders || orders.length === 0) break;

    for (const o of orders) {
      try {
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
              // ✅ store Woo ID here
              wooProductId: item.product_id || null,
              // ❌ DO NOT set this yet
              productId: null,
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
        console.error(`[SYNC] Failed on order #${o.id}:`, err.message);
        totalFailed++;
      }
    }

    console.log(`[SYNC] Page ${page} done — ${orders.length} orders processed`);

    // If less than 100 returned, this was the last page
    if (orders.length < 50) break;
    page++;
  }

  console.log(
    `[SYNC] Finished. Synced: ${totalSynced} | Failed: ${totalFailed}`,
  );

  return { totalSynced, totalFailed };
};

export default syncOrders;
