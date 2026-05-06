import api from "../lib/api";

//! Login
export const login = async (email, password, captchaToken) =>
  api.post("/auth/login", { email, password, captchaToken });

//! Register
export const register = async (data) =>
  api.post("/auth/register", data);

//! Get Profile
export const getProfile = async () =>
  api.get("/auth/me");

//! Logout
export const logout = async () => 
  api.post("/auth/logout");

//! Forgot Password
export const forgotPassword = async (email) =>
  api.post("/auth/forgot-password", { email });

//! Reset Password
export const resetPassword = async (data) =>
  api.post("/auth/reset-password", data);