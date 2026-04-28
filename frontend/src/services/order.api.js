import api from "../lib/api";

//! trigger order sync
export const triggerOrderSync = async (storeId) =>
  api.post(`/sync/${storeId}/orders`);

//! trigger force order sync
export const triggerForceOrderSync = async (storeId, data) =>
  api.post(`/sync/${storeId}/orders/force`, data);


//! get Orders
export const getOrders = async (storeId, params = {}) =>
  api.get(`/orders/${storeId}`, { params });

//! get Order by id
export const getOrderById = async (storeId, orderId) =>
  api.get(`/orders/${storeId}/${orderId}`);

//! remove order item
export const removeOrderItem = async (orderId, orderItemId) =>
  api.delete(`/orders/${orderId}/items/${orderItemId}`);

//! update shipping address
export const updateShippingAddress = async (orderId, data) =>
  api.put(`/orders/${orderId}/shipping`, data);