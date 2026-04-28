import { syncOrders } from "../lib/orderSyncService.js";
import prisma from "../lib/prisma.js";
import cron from "node-cron";
import pLimit from "p-limit";

const limit = pLimit(3); //limit the number of concurrent jobs, max 3 at a time

// 🔥 MAIN JOB FUNCTION
const runOrderAutoSync = async () => {
  console.log("🟡 [CRON] Order auto-sync started at", new Date().toISOString());

  try {
    //1 Get all stores
    const stores = await prisma.store.findMany({
      where: {
        status: "ACTIVE",
      },
    });

    if (stores.length === 0) {
      console.log("🟢 [CRON] No active stores found. Exiting...");
      return;
    }

    //2 process all stores with concurrency limit
    await Promise.all(
      stores.map((store) =>
        limit(async () => {
          try {
            console.log(
              `🟢 [CRON] Starting sync for store #${store.id} - ${store.name}`,
            );

            await syncOrders(store);

            console.log(`🟢 [CRON] Sync for store #${store.id} completed`);
          } catch (error) {
            console.error(
              `🔴 [CRON] Error syncing store #${store.id}:`,
              error.message,
            );
          }
        }),
      ),
    );

    console.log(
      "🟢 [CRON] Order auto-sync completed at",
      new Date().toISOString(),
    );
  } catch (error) {
    console.error("🔴 [CRON] Error in order auto-sync:", error.message);
  }
};

// 🕒 CRON SCHEDULER (Every 60 minutes)
const startAutoSyncJob = () => {
  cron.schedule("*/60 * * * *", async () => {
    await runOrderAutoSync();
  });
};

export default startAutoSyncJob;
