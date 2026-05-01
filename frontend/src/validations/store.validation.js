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
});

//! Auspost Setting Validation
export const auspostSettingSchema = z.object({
  accountNumber: z.string().min(1, "Required"),
  accountMode: z.enum(["sandbox", "production"]),
  apiKey: z.string().min(1, "Required"),
  apiPassword: z.string().min(1, "Required"),

  address: z.string().min(1),
  suburb: z.string().min(1),
  state: z.string().min(1),
  postcode: z.string().min(1),
  countryCode: z.string().min(1),

  companyName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),

  combineConsignment: z.enum(["yes", "no"]),
  allowPartial: z.enum(["yes", "no"]),
  branding: z.enum(["yes", "no"]),

  labelLayoutParcel: z.string(),
  labelLayoutExpress: z.string(),

  leftSpace: z.string(),
  topSpace: z.string(),

  autoPrint: z.enum(["yes", "no"]),
});