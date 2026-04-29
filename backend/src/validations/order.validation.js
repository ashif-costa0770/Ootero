import { z } from "zod";

const statusEnum = [
  "pending",
  "processing",
  "on-hold",
  "completed",
  "cancelled",
];
export const orderStatusEnum = z.enum(statusEnum);

//! Update Shipping Address Form Validation
export const updateShippingSchema = z.object({
  shippingFirstName: z.string().optional(),
  shippingLastName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingCompany: z.string().optional(),
  shippingAddress1: z
    .string()
    .min(1, { message: "Shipping address 1 is required" }),
  shippingAddress2: z.string().optional(),
  shippingCity: z.string().min(1, { message: "Shipping city is required" }),
  shippingState: z.string().min(1, { message: "Shipping state is required" }),
  shippingPostcode: z
    .string()
    .min(1, { message: "Shipping postcode is required" }),
  shippingCountry: z.string().optional(),
});

//! Update Package Info Form Validation
export const updatePackageInfoSchema = z.object({
  qty: z.coerce.number().min(1, "Qty must be at least 1"),
  weight: z.coerce.number().min(0, "Weight must be 0 or greater"),
  length: z.coerce.number().min(0, "Length must be 0 or greater"),
  width: z.coerce.number().min(0, "Width must be 0 or greater"),
  height: z.coerce.number().min(0, "Height must be 0 or greater"),
  orderNote: z.string().trim().optional(),
});

//! Change status for selected orders
export const changeOrderStatusSchema = z.object({
  orderIds: z
    .array(z.coerce.number().int().positive("Invalid order id"))
    .min(1, "Please select at least one order"),
  status: orderStatusEnum,
});
