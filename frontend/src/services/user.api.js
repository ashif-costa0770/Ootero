import api from "../lib/api";

//! Get User Profile based on id
export const getUserProfile = async (userId) =>
  api.get(`/user/${userId}`);