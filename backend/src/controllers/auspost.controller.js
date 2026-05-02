import prisma from "../lib/prisma.js";
import { decrypt, encrypt } from "../utils/encryption.js";
import { errorResponse, successResponse } from "../utils/respones.js";

//! Build response payload
function buildResponsePayload(store, auspost) {
  return {
    accountNumber: auspost?.accountNumber ?? "",
    accountMode: auspost?.accountMode ?? "SANDBOX",
    apiKey: auspost?.apiKey ? decrypt(auspost.apiKey) : "",
    apiPassword: auspost?.apiPassword ? decrypt(auspost.apiPassword) : "",
    address: store.address ?? "",
    suburb: store.suburb ?? "",
    state: store.state ?? "",
    postcode: store.postcode ?? "",
    countryCode: store.countryCode ?? "",
    companyName: store.companyName ?? "",
    email: store.email ?? "",
    phone: store.phone ?? "",
    combineConsignment: auspost?.combineConsignment ?? "YES",
    allowPartialDelivery: auspost?.allowPartialDelivery ?? "YES",
    postBranding: auspost?.postBranding ?? "YES",
    labelLayoutParcel: auspost?.labelLayoutParcel ?? "A4",
    labelLayoutExpress: auspost?.labelLayoutExpress ?? "A4",
    leftSideSpace: auspost?.leftSideSpace ?? "",
    topSideSpace: auspost?.topSideSpace ?? "",
    streetType: auspost?.streetType ?? "",
    autoPrint: auspost?.autoPrint ?? "YES",
  };
}

//! Get auspost settings
export const getAuspostSettings = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;

    //validate storeId
    if (isNaN(storeId)) {
      return errorResponse(res, 400, "Invalid store ID");
    }

    //find the store
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId: userId,
      },
      include: { auspostSetting: true },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    const { auspostSetting, ...storeData } = store;
    const responsePayload = buildResponsePayload(storeData, auspostSetting);

    return successResponse(
      res,
      200,
      "Auspost settings fetched successfully",
      responsePayload,
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in getting auspost settings",
      error.message,
    );
  }
};

//! Upsert auspost settings
export const upsertAuspostSettings = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;

    //validate storeId
    if (isNaN(storeId)) {
      return errorResponse(res, 400, "Invalid store ID");
    }

    //find the store
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId: userId,
      },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    const b = req.body;

    // transation to update store and auspost settings
    await prisma.$transaction([
      prisma.store.update({
        where: { id: storeId },
        data: {
          companyName: b.companyName,
          email: b.email,
          phone: b.phone,
          address: b.address,
          suburb: b.suburb,
          state: b.state,
          postcode: b.postcode,
          countryCode: b.countryCode,
        },
      }),
      prisma.auspostSetting.upsert({
        where: { storeId: storeId },
        create: {
          storeId: storeId,
          accountNumber: b.accountNumber,
          accountMode: b.accountMode,
          apiKey: encrypt(b.apiKey),
          apiPassword: encrypt(b.apiPassword),
          combineConsignment: b.combineConsignment,
          allowPartialDelivery: b.allowPartialDelivery,
          postBranding: b.postBranding,
          labelLayoutParcel: b.labelLayoutParcel,
          labelLayoutExpress: b.labelLayoutExpress,
          leftSideSpace: b.leftSideSpace,
          topSideSpace: b.topSideSpace,
          streetType: b.streetType,
          autoPrint: b.autoPrint,
        },
        update: {
          accountNumber: b.accountNumber,
          accountMode: b.accountMode,
          apiKey: encrypt(b.apiKey),
          apiPassword: encrypt(b.apiPassword),
          combineConsignment: b.combineConsignment,
          allowPartialDelivery: b.allowPartialDelivery,
          postBranding: b.postBranding,
          labelLayoutParcel: b.labelLayoutParcel,
          labelLayoutExpress: b.labelLayoutExpress,
          leftSideSpace: b.leftSideSpace,
          topSideSpace: b.topSideSpace,
          streetType: b.streetType,
          autoPrint: b.autoPrint,
        },
      }),
    ]);

    const updated = await prisma.store.findFirst({
      where: { id: storeId, userId: userId },
      include: { auspostSetting: true },
    });

    const { auspostSetting, ...storeData } = updated;
    const responsePayload = buildResponsePayload(storeData, auspostSetting);

    return successResponse(
      res,
      200,
      "Auspost settings updated successfully",
      responsePayload,
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in upserting auspost settings",
      error.message,
    );
  }
};
