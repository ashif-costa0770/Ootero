import { z } from "zod";

export const forceSyncSchema = z
  .object({
    status: z.string().optional(),

    fromDate: z.string().optional(),
    toDate: z.string().optional(),

    orderIds: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) return [];
        return value
          .split(/[\n,]+/)
          .map((v) => Number(v.trim()))
          .filter((n) => Number.isInteger(n) && n > 0);
      }),
  })
  .refine(
    (data) =>
      data.status ||
      data.fromDate ||
      data.toDate ||
      (data.orderIds && data.orderIds.length > 0),
    {
      message: "At least one filter is required",
      path: ["_errors"], // general form error
    },
  );

export const updateShippingAddressSchema = z.object({
  shippingAddress1: z
    .string()
    .trim()
    .min(1, { message: "Shipping address 1 is required" }),
  shippingAddress2: z.string().trim().optional(),
  shippingCity: z.string().trim().min(1, { message: "Shipping city is required" }),
  shippingState: z
    .string()
    .trim()
    .min(1, { message: "Shipping state is required" }),
  shippingPostcode: z
    .string()
    .trim()
    .min(1, { message: "Shipping postcode is required" }),
});

//! Ship To Form Validation
export const shipToSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().optional(),
  companyName: z.string().trim().optional(),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  googleSearchAddress: z
    .string()
    .trim()
    .min(1, "Google Search Address is required"),
  addressLine1: z.string().trim().min(1, "Address line 1 is required"),
  addressLine2: z.string().trim().optional(),
  suburb: z.string().trim().min(1, "Suburb is required"),
  state: z.string().trim().min(1, "State is required"),
  postcode: z.string().trim().min(1, "Postcode is required"),
  country: z.string().trim().min(1, "Country/Region is required"),
});


//! From Address Form Validation
export const fromAddressSchema = z.object({
  addressLine1: z.string().trim().min(1, "Address line 1 is required"),
  addressLine2: z.string().trim().optional(),
  suburb: z.string().trim().min(1, "Suburb is required"),
  state: z.string().trim().min(1, "State is required"),
  postcode: z.string().trim().min(1, "Postcode is required"),
  country: z.string().trim().min(1, "Country/Region is required"),
});

//! Package Info Form Validation
export const packageInfoSchema = z.object({
  consignment: z.string().trim().min(1, "Consignment is required"),
  qty: z.coerce.number().min(1, "Qty must be at least 1"),
  weight: z.coerce.number().min(0, "Weight must be 0 or greater"),
  length: z.coerce.number().min(0, "Length must be 0 or greater"),
  width: z.coerce.number().min(0, "Width must be 0 or greater"),
  height: z.coerce.number().min(0, "Height must be 0 or greater"),
  packageReference: z.string().trim().min(1, "Package reference is required"),
  coverAmount: z.coerce.number().min(0, "Cover amount must be 0 or greater"),
  orderNote: z.string().trim().optional(),
});