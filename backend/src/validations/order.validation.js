import { z } from "zod";

export const updateShippingSchema = z.object({
  shippingFirstName: z.string().optional(),
  shippingLastName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingAddress1: z.string().min(1, { message: "Shipping address 1 is required" }),
  shippingAddress2: z.string().optional(),
  shippingCity: z.string().min(1, { message: "Shipping city is required" }),
  shippingState: z.string().min(1, { message: "Shipping state is required" }),
  shippingPostcode: z.string().min(1, { message: "Shipping postcode is required" }),
  shippingCountry: z.string().optional(),
});