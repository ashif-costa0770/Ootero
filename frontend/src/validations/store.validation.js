import { z } from "zod";

const platforms = ["woocommerce", "shopify", "ebay", "magento", "bigcommerce", "prestashop"];

//! Connect Store Validation
export const connectStoreSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),

  platform: z.enum(platforms, {
    errorMap: () => ({ message: "Invalid platform" }),
  }),

  storeUrl: z.string().url("Invalid store URL").trim(),

  consumerKey: z.string().min(1, "Consumer key is required").trim(),

  consumerSecret: z.string().min(1, "Consumer secret is required").trim(),
});

//! Add Store Validation
export const addStoreSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),

  platform: z.enum(platforms, {
    errorMap: () => ({ message: "Invalid platform" }),
  }),

  storeUrl: z.string().url("Invalid store URL").trim(),

  consumerKey: z.string().min(1, "Consumer key is required").trim(),

  consumerSecret: z.string().min(1, "Consumer secret is required").trim(),
});

//! Store Setting Validation
export const storeSettingSchema = z.object({
  name: z.string().min(1, "Store name required").trim(),
  storeUrl: z.string().url("Invalid URL").trim(),
  consumerKey: z.string().min(1, "Consumer key is required").trim(),
  consumerSecret: z.string().min(1, "Consumer secret is required").trim(),
});