import api from "../lib/api";

//! trigger order sync
export const triggerOrderSync = async (storeId) =>
  api.post(`/sync/${storeId}/orders`);

//! trigger force order sync
export const triggerForceOrderSync = async (storeId, data) =>
  api.post(`/sync/${storeId}/orders/force`, data);


//! enable/disable order auto sync
export const toggleOrderAutoSync = async (storeId, enabled) =>
  api.patch(`/sync/${storeId}/orders/auto-sync/toggle`, { enabled });

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

//! update package info
export const updatePackageInfo = async (orderId, data) =>
  api.put(`/orders/${orderId}/package`, data);

//! change status for selected orders
export const changeOrderStatus = async (orderIds, status) =>
  api.put("/orders/bulk/status", { orderIds, status });