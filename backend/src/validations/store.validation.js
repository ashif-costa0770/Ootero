import { z } from "zod";

const platforms = ["woocommerce", "shopify", "ebay", "magento", "bigcommerce", "prestashop"];

const accountModes = ["SANDBOX", "PRODUCTION"];
const yesNoEnum = ["YES", "NO"];

export const connectStoreSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),

  platform: z.enum(platforms, {
    errorMap: () => ({ message: "Invalid platform" }),
  }),

  storeUrl: z.string().url("Invalid store URL").trim(),

  consumerKey: z.string().min(1, "Consumer key is required").trim(),

  consumerSecret: z.string().min(1, "Consumer secret is required").trim(),
});

//! Update store settings
export const updateStoreSettingsSchema = z.object({
  name: z.string().min(1, "Store name required").trim(),
  storeUrl: z.string().url("Invalid URL").trim(),
  consumerKey: z.string().min(1, "Consumer key is required").trim(),
  consumerSecret: z.string().min(1, "Consumer secret is required").trim(),
});


//! Auspost Setting Validation
export const auspostSettingSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
  accountMode: z.enum(accountModes, {
    errorMap: () => ({ message: "Invalid account mode" }),
  }),
  apiKey: z.string().min(1, "API key is required"),
  apiPassword: z.string().min(1, "API password is required"),

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
export const auspostShippingRulesBodySchema = z.object({
  rules: z
    .array(
      z.object({
        ruleName: z.string().trim().min(1, "Rule name is required"),
        postageService: z.string().trim().min(1, "Postage service is required"),
        shippingMethod: z.string().trim().min(1, "Shipping method is required"),
      }),
    )
    .min(1, "At least one rule is required"),
});

//! Package settings validation
export const packageSettingSchema = z.object({
    packages: z
      .array(
        z.object({
          name: z.string().trim().min(1, "Package name is required"),

          weight: z.number().positive("Weight is required"),
          width: z.number().positive("Width is required"),
          length: z.number().positive("Length is required"),
          height: z.number().positive("Height is required"),

          isDefault: z.boolean(),
        }),
      )
      .min(1, "At least one package required"),
  })
  .refine(
    (data) => {
      const defaultCount = data.packages.filter((p) => p.isDefault).length;
      return defaultCount === 1;
    },
    {
      message: "Exactly one package must be set as default",
      path: ["packages"],
    },
  );