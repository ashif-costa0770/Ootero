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
    // shippingRules: auspost?.shippingRules != null ? auspost.shippingRules : [],
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

//! Update auspost shipping rules
export const updateAuspostShippingRules = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;
    const { rules } = req.body;

    //validate storeId
    if (isNaN(storeId)) {
      return errorResponse(res, 400, "Invalid store ID");
    }

    //find the store
    const store = await prisma.store.findFirst({
      where: { id: storeId, userId: userId },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    const existing = await prisma.auspostSetting.findFirst({
      where: { storeId: storeId },
    });

    if (!existing) {
      return errorResponse(
        res,
        404,
        "Auspost settings not fouund. Save Auspost settings first.",
      );
    }

    await prisma.auspostSetting.update({
      where: { storeId: storeId },
      data: { shippingRules: rules },
    });

    return successResponse(
      res,
      200,
      "Auspost shipping rules updated successfully",
      {
        rules,
      },
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in updating auspost shipping rules",
      error.message,
    );
  }
};

//! Get auspost shipping rules
export const getAuspostShippingRules = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;

    //validate storeId
    if (isNaN(storeId)) {
      return errorResponse(res, 400, "Invalid store ID");
    }

    //find the store
    const store = await prisma.store.findFirst({
      where: { id: storeId, userId: userId },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    //find the auspost settings
    const auspost = await prisma.auspostSetting.findFirst({
      where: { storeId: storeId },
    });

    let rules = [];
    if (
      auspost?.shippingRules != null &&
      Array.isArray(auspost.shippingRules)
    ) {
      rules = auspost.shippingRules;
    }

    return successResponse(
      res,
      200,
      "Auspost shipping rules fetched successfully",
      rules,
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in getting auspost shipping rules",
      error.message,
    );
  }
};

//! get package settings
export const getPackageSettings = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;

    //validate storeId
    if (isNaN(storeId)) {
      return errorResponse(res, 400, "Invalid store ID");
    }

    //find the store
    const store = await prisma.store.findFirst({
      where: { id: storeId, userId: userId },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    //find the auspost settings
    const auspost = await prisma.auspostSetting.findFirst({
      where: { storeId: storeId },
    });

    let packages = [];
    if (
      auspost?.packageSettings != null &&
      Array.isArray(auspost.packageSettings)
    ) {
      packages = auspost.packageSettings;
    }

    return successResponse(
      res,
      200,
      "Package settings fetched successfully",
      packages,
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in getting package settings",
      error.message,
    );
  }
};

//! update package settings
export const updatePackageSettings = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;
    const { packages } = req.body;

    //validate storeId
    if (isNaN(storeId)) {
      return errorResponse(res, 400, "Invalid store ID");
    }

    //find the store
    const store = await prisma.store.findFirst({
      where: { id: storeId, userId },
    });
    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    //find the auspost settings
    const auspost = await prisma.auspostSetting.findFirst({
      where: { storeId },
    });

    if (!auspost) {
      return errorResponse(
        res,
        404,
        "Auspost settings not fouund. Save Auspost settings first.",
      );
    }

    //update the package settings
    await prisma.auspostSetting.update({
      where: { storeId },
      data: { packageSettings: packages },
    });

    return successResponse(
      res,
      200,
      "Package settings updated successfully",
      packages,
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in updating package settings",
      error.message,
    );
  }
};

//! get auspost declarations
export const getAuspostDeclarations = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;

    //validate storeId
    if (isNaN(storeId)) {
      return errorResponse(res, 400, "Invalid store ID");
    }

    //find the store
    const store = await prisma.store.findFirst({
      where: { id: storeId, userId: userId },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    //find the auspost settings
    const auspost = await prisma.auspostSetting.findFirst({
      where: { storeId: storeId },
    });

    let declarations = [];
    if (auspost?.declarations != null && Array.isArray(auspost.declarations)) {
      declarations = auspost.declarations;
    }

    return successResponse(
      res,
      200,
      "Auspost declarations fetched successfully",
      declarations,
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in getting auspost declarations",
      error.message,
    );
  }
};

//! update auspost declarations
export const updateAuspostDeclarations = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;
    const { declarations } = req.body;
    
    //validate storeId
    if (isNaN(storeId)) {
      return errorResponse(res, 400, "Invalid store ID");
    }

    //find the store
    const store = await prisma.store.findFirst({
      where: { id: storeId, userId: userId },
    });

    if (!store) {
      return errorResponse(res, 404, "Store not found");
    }

    //find the auspost settings
    const auspost = await prisma.auspostSetting.findFirst({
      where: { storeId: storeId },
    });

    if (!auspost) {
      return errorResponse(
        res,
        404,
        "Auspost settings not fouund. Save Auspost settings first.",
      );
    }

    //update the declarations
    await prisma.auspostSetting.update({
      where: { storeId },
      data: { declarations: declarations },
    });
    return successResponse(
      res,
      200,
      "Auspost declarations fetched successfully",
      declarations,
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in getting auspost declarations",
      error.message,
    );
  }
};
