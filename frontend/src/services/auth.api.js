import api from "../lib/api";

export const login = async (email, password, captchaToken) =>
  api.post("/auth/login", { email, password, captchaToken });


export const register = async (data) =>
  api.post("/auth/register", data);