import api from "../lib/api";

//! Connect store
export const connectStore = async (data) =>
  api.post("/store/connect", data);

//! Get all stores
export const getAllStores = async () =>
  api.get("/store");

//! Get single store
export const getSingleStore = async (storeId) =>
  api.get(`/store/${storeId}`);

//! Get store details
export const getStoreDetails = async (storeId) =>
  api.get(`/store/${storeId}/details`);

//! Test store connection
export const testStoreConnection = async (storeId) =>
  api.get(`/store/${storeId}/test`);

//! Update store settings
export const updateStoreSettings = async (storeId, data) =>
  api.put(`/store/${storeId}`, data);
