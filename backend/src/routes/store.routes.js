import express from "express";
import {
  connectStore,
  getStoreDetails,
  getAllStores,
  testStoreConnection,
  getSingleStore,
  updateStoreSettings,
} from "../controllers/store.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.js";
import {
  connectStoreSchema,
  updateStoreSettingsSchema,
} from "../validations/store.validation.js";
import { auspostSettingSchema } from "../validations/store.validation.js";
import {
  getAuspostSettings,
  upsertAuspostSettings,
  updateAuspostShippingRules,
  getAuspostShippingRules,
  getAuspostDeclarations,
  updateAuspostDeclarations,
} from "../controllers/auspost.controller.js";
import { auspostShippingRulesBodySchema } from "../validations/store.validation.js";
import {
  getPackageSettings,
  updatePackageSettings,
} from "../controllers/auspost.controller.js";
import { packageSettingSchema } from "../validations/store.validation.js";
import { auspostDeclarationsBodySchema } from "../validations/store.validation.js";

const router = express.Router();

router.post("/connect", protect, validate(connectStoreSchema), connectStore);
router.get("/", protect, getAllStores);
router.get("/:storeId", protect, getSingleStore);
router.get("/:storeId/details", protect, getStoreDetails);
router.get("/:storeId/test", protect, testStoreConnection);
//! Update store settings
router.put(
  "/:storeId",
  protect,
  validate(updateStoreSettingsSchema),
  updateStoreSettings,
);

//! Auspost routes
router.get("/:storeId/auspost-settings", protect, getAuspostSettings);

//shipping rules routes
router.get(
  "/:storeId/auspost-settings/shipping-rules",
  protect,
  getAuspostShippingRules,
);
router.put(
  "/:storeId/auspost-settings/shipping-rules",
  protect,
  validate(auspostShippingRulesBodySchema),
  updateAuspostShippingRules,
);

//package settings routes
router.get(
  "/:storeId/auspost-settings/package-settings",
  protect,
  getPackageSettings,
);
router.put(
  "/:storeId/auspost-settings/package-settings",
  protect,
  validate(packageSettingSchema),
  updatePackageSettings,
);

//! Declaration routes
router.get(
  "/:storeId/auspost-settings/declarations",
  protect,
  getAuspostDeclarations,
);
router.put(
  "/:storeId/auspost-settings/declarations",
  protect,
  validate(auspostDeclarationsBodySchema),
  updateAuspostDeclarations,
);

//auspost settings routes
router.put(
  "/:storeId/auspost-settings",
  protect,
  validate(auspostSettingSchema),
  upsertAuspostSettings,
);


export default router;
