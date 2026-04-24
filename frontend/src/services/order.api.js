import api from "../lib/api";

//! get Orders
export const getOrders = async (storeId, params = {}) =>
  api.get(`/orders/${storeId}`, { params });

//! trigger order sync
export const triggerOrderSync = async (storeId) =>
  api.post(`/sync/${storeId}/orders`);