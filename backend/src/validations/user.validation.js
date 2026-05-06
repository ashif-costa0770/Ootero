// validations/user.validation.js

import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  direction: z
    .enum(["SYSTEM", "LTR", "RTL"])
    .optional(),

  facebook: z
    .string()
    .trim()
    .url("Invalid Facebook URL")
    .optional()
    .or(z.literal("")),

  linkedIn: z
    .string()
    .trim()
    .url("Invalid LinkedIn URL")
    .optional()
    .or(z.literal("")),

  skype: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});