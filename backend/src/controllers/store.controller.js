import prisma from "../lib/prisma.js";
import { encrypt } from "../utils/encryption.js";
import { errorResponse, successResponse } from "../utils/respones.js";
import { verifyWooCommerce } from "../utils/verifyPlatform.js";

export const connectStore = async (req, res) => {
  const { name, platform, storeUrl, consumerKey, consumerSecret } = req.body;

  const userId = req.user.id;

  try {

    //TODO: Check if store already exists
    const existingStore = await prisma.store.findUnique({
        where: {
            storeUrl: storeUrl,
            userId: userId,
        },
    })
    
    if (existingStore) {
        return errorResponse(res, 400, "Store already connected");
    }

    // 1. Verify credentials
    let isValid = false;

    if (platform === "WOOCOMMERCE") {
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
