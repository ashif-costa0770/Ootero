import express from "express";
import { connectStore, getStoreDetails, getAllStores, testStoreConnection, getSingleStore, updateStoreSettings } from "../controllers/store.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.js";
import { connectStoreSchema, updateStoreSettingsSchema } from "../validations/store.validation.js";
import { auspostSettingSchema } from "../validations/store.validation.js";
import { getAuspostSettings, upsertAuspostSettings } from "../controllers/auspost.controller.js";


const router = express.Router();

router.post("/connect", protect, validate(connectStoreSchema), connectStore);
router.get("/", protect, getAllStores);
router.get("/:storeId", protect, getSingleStore);
router.get("/:storeId/details", protect, getStoreDetails);
router.get("/:storeId/test", protect, testStoreConnection);
//! Update store settings
router.put("/:storeId", protect, validate(updateStoreSettingsSchema), updateStoreSettings);

//! Auspost routes
router.get("/:storeId/auspost-settings", protect, getAuspostSettings);
router.put(
  "/:storeId/auspost-settings",
  protect,
  validate(auspostSettingSchema),
  upsertAuspostSettings,
);
export default router;