import { z } from "zod";

const platforms = ["woocommerce", "shopify", "ebay", "magento", "bigcommerce", "prestashop"];

const accountModes = ["SANDBOX", "PRODUCTION"];
const yesNoEnum = ["YES", "NO"];

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
  accountNumber: z.string().min(1, "Account number is required"),
  accountMode: z.enum(accountModes, {
    errorMap: () => ({ message: "Invalid account mode" }),
  }),

  address: z.string().min(1, "Store address is required"),
  suburb: z.string().min(1, "Store suburb is required"),
  state: z.string().min(1, "Store state is required"),
  postcode: z.string().min(1, "Store postcode is required"),
  countryCode: z.string().min(1, "Store country code is required"),

  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Store phone is required"),

  combineConsignment: z.enum(yesNoEnum, {
    errorMap: () => ({ message: "Invalid combine consignment" }),
  }),
  allowPartialDelivery: z.enum(yesNoEnum, {
    errorMap: () => ({ message: "Invalid allow partial" }),
  }),
  postBranding: z.enum(yesNoEnum, {
    errorMap: () => ({ message: "Invalid post branding" }),
  }),

  labelLayoutParcel: z.string().min(1, "Label layout for parcel post is required"),
  labelLayoutExpress: z.string().min(1, "Label layout for express post is required"),

  leftSideSpace: z.string().min(1, "Label leftside space is required"),
  topSideSpace: z.string().min(1, "Label topside space is required"),

  streetType: z.string().min(1, "Street type is required"),
  autoPrint: z.enum(yesNoEnum, {
    errorMap: () => ({ message: "Invalid auto print" }),
  }),
});

//! Shipping Rule Validation
export const shippingRuleSchema = z.object({
  rules: z
    .array(
      z.object({
        ruleName: z.string().min(1, "Required"),
        postageService: z.string().min(1, "Required"),
        shippingMethod: z.string().min(1, "Required"),
      })
    )
    .min(1, "At least one rule is required"),
});