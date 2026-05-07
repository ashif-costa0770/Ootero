import api from "../lib/api";

//! Get User Profile based on id
export const getUserProfile = async (userId) =>
  api.get(`/user/${userId}`);

//! Update User Profile
export const updateUserProfile = async (userId, formData) =>
  api.put(`/user/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

//! Change Password
export const changePassword = async (userId, data) =>
  api.put(`/user/${userId}/change-password`, data);