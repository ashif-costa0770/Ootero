import api from "../lib/api";

export const login = async (email, password, captchaToken) =>
  api.post("/auth/login", { email, password, captchaToken });


export const register = async (data) =>
  api.post("/auth/register", data);

export const forgotPassword = async (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = async (data) =>
  api.post("/auth/reset-password", data);