import { z } from "zod";

//! Register Validation

export const registerSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.email({ message: "Invalid email address" }).trim().toLowerCase(),
    phone: z.string().optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, { message: "Confirm password required" }),
    country: z.string().optional(),
    company: z.string().optional(),
    shipmentRange: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

//! Login Validation
export const loginSchema = z.object({
    email: z.email({ message: "Invalid email address" }).trim().toLowerCase(),
    password: z.string().min(8, { message: "Password required" }).trim(),

});


//! Forgot Password Validation
export const forgotPasswordSchema = z.object({
    email: z.email({ message: "Invalid email address" }).trim().toLowerCase(),
});

//! Reset Password Validation
export const resetPasswordSchema = z.object({
    token: z.string().min(1, { message: "Token required" }).trim(),      
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
    confirmPassword: z.string().min(8, { message: "Confirm password required" }).trim(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});