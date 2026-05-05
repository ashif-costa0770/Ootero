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
}).superRefine((data, ctx) => {
  // Existing ruleName uniqueness
  const seenRuleNames = new Map();

  // New postageService keyword uniqueness
  const seenPostageKeywords = new Map();

  data.rules.forEach((rule, index) => {
    // 1) Rule name unique check (keep your current logic)
    const normalizedRuleName = rule.ruleName.trim().toLowerCase();
    if (normalizedRuleName) {
      if (seenRuleNames.has(normalizedRuleName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rules", index, "ruleName"],
          message: "Rule name must be unique",
        });
      } else {
        seenRuleNames.set(normalizedRuleName, index);
      }
    }

    // 2) Postage service keyword unique check
    const keywords = rule.postageService
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    // Optional: detect duplicate keyword inside same row too
    const seenInCurrentRow = new Set();

    for (const keyword of keywords) {
      if (seenInCurrentRow.has(keyword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rules", index, "postageService"],
          message: `Duplicate keyword "${keyword}" in same row`,
        });
        continue;
      }
      seenInCurrentRow.add(keyword);

      if (seenPostageKeywords.has(keyword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rules", index, "postageService"],
          message: `Keyword "${keyword}" already used in another row`,
        });
      } else {
        seenPostageKeywords.set(keyword, index);
      }
    }
  });
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
  ).superRefine((data, ctx) => {
    const seen = new Map();
    data.packages.forEach((pkg, index) => {
      const normalized = pkg.name.trim().toLowerCase();
      if (!normalized) return;
      if (seen.has(normalized)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["packages", index, "name"],
          message: "Package name must be unique",
        });
      } else {
        seen.set(normalized, index);
      }
    });
  });


//! Declaration line items (matches frontend itemSchema)
const declarationItemSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  quantity: z.number().min(1),
  unitValue: z.number().min(0),
  weight: z.number().min(0),
  countryOfOrigin: z.string().optional(),
  tariffCode: z.string().optional(),
  tariffConcession: z.string().optional(),
  sku: z.string().optional(),
  reference: z.string().optional(),
});

//! One saved declaration record
export const declarationRecordSchema = z.object({
  itemDescription: z.string().trim().min(1, "Item description is required"),
  reason: z.string().min(1, "Reason is required"),
  importRef: z.string().trim().min(1, "Import reference is required"),
  itemReference: z.string().trim().min(1, "Item reference is required"),
  descriptionOfOther: z.string().trim().min(1, "Description of other is required"),
  itemLength: z.number().min(0),
  itemHeight: z.number().min(0),
  itemWeight: z.number().min(0),
  itemWidth: z.number().min(0),
  hasCommercialValue: z.boolean(),
  items: z.array(declarationItemSchema).min(1, "At least one item required"),
});
