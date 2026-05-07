import { z } from "zod";

//! Update User Profile Validation
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

  emailSignature: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});


//! Change Password Validation
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, { message: "Current password required" }).trim(),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
  confirmPassword: z.string().min(8, { message: "Confirm password required" }).trim(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
