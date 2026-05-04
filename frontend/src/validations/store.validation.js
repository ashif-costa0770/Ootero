import { z } from "zod";

const platforms = [
  "woocommerce",
  "shopify",
  "ebay",
  "magento",
  "bigcommerce",
  "prestashop",
];

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

  labelLayoutParcel: z
    .string()
    .min(1, "Label layout for parcel post is required"),
  labelLayoutExpress: z
    .string()
    .min(1, "Label layout for express post is required"),

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
        ruleName: z.string().min(1, "Rule name is required"),
        postageService: z.string().min(1, "Postage service is required"),
        shippingMethod: z.string().min(1, "Shipping method is required"),
      }),
    )
    .min(1, "At least one rule is required"),
});

//! Package seeting validation

export const packageSettingSchema = z
  .object({
    packages: z
      .array(
        z.object({
          name: z.string().trim().min(1, "Required"),

          weight: z.number().positive("Required"),
          width: z.number().positive("Required"),
          length: z.number().positive("Required"),
          height: z.number().positive("Required"),

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


//! Declaration form validation
//item component schema
export const itemSchema = z.object({
  description: z.string().min(1, "Required"),
  quantity: z.number().min(1),
  unitValue: z.number().min(0),
  weight: z.number().min(0),

  countryOfOrigin: z.string().optional(),
  tariffCode: z.string().optional(),
  tariffConcession: z.string().optional(),
  sku: z.string().optional(),
  reference: z.string().optional(),
});

//  declaration form schema
export const declarationSchema = z.object({
  itemDescription: z.string().min(1, "Item description is required"),
  reason: z.string().min(1),
  importRef: z.string().min(1, "Import reference is required"),
  itemReference: z.string().min(1, "Item reference is required"),
  descriptionOfOther: z.string().min(1, "Description of other is required"),
  itemReference: z.string().min(1, "Item reference is required"),
  itemLength: z.number().min(0, "Item length is required"),
  itemHeight: z.number().min(0, "Item height is required"),
  itemWeight: z.number().min(0, "Item weight is required"),
  itemWidth: z.number().min(0, "Item width is required"),

  hasCommercialValue: z.boolean(),

  items: z.array(itemSchema).min(1, "At least one item required"),
});