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
