import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderFilter from '../../components/admin/OrderFilter'
import OrdersTable from '../../components/datatable/OrdersTable'
import { getOrders, removeOrderItem } from '../../services/order.api'
import { toast } from "sonner";
import UpdateShippingAddressForm from "../../components/form/UpdateShippingAddressForm";

const STATUS_FROM_ROUTE = {
  pending: "pending",
  processing: "processing",
  onhold: "on-hold",
  completed: "completed",
  cancelled: "cancelled",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [statusCounts, setStatusCounts] = useState({});
  const [selectedOrderForShippingEdit, setSelectedOrderForShippingEdit] =
    useState(null);
  const { storeId, statusKey } = useParams();
  const status = STATUS_FROM_ROUTE[statusKey] || "";

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleLimitChange = (value) => {
    setPage(1);
    setLimit(value);
  };

  //remove order item
  const handleRemoveItem = async (orderId, orderItemId) => {
    try {
      const ok = window.confirm("Delete this item from the order?");
      if (!ok) return;
  
      const response = await removeOrderItem(orderId, orderItemId);
      const message = response?.data?.message || "Item removed successfully";
      toast.success(message);
  
      await fetchOrders(); // refresh table immediately
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to remove item";
      toast.error(message);
    }
  };

  const fetchOrders = async () => {
    if (!storeId) {
      setError("Store ID is missing from URL.");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      const res = await getOrders(storeId, { page, limit, search, status });
      const payload = res?.data?.data || {};
      setOrders(payload.data || []);
      setPagination(
        payload.pagination || {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      );
      setStatusCounts(payload.statusCounts || {});
    } catch (error) {
      setError(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [storeId, page, limit, search, status]);

  useEffect(() => {
    setPage(1);
  }, [storeId, statusKey]);

  const handleOpenShippingEditModal = (order) => {
    setSelectedOrderForShippingEdit(order);
  };

  const handleCloseShippingEditModal = () => {
    setSelectedOrderForShippingEdit(null);
  };

  const handleShippingUpdateSuccess = async () => {
    handleCloseShippingEditModal();
    await fetchOrders();
  };

  return (
    <div className='flex flex-col gap-4 p-4  bg-gray-100'>
      {/* Filter section */}
      <OrderFilter
        statusCounts={statusCounts}
       />

      {/* Table section */}
      <OrdersTable
        orders={orders}
        loading={loading}
        error={error}
        search={search}
        onSearchChange={handleSearchChange}
        pagination={pagination}
        onNextPage={() => setPage((prev) => prev + 1)}
        onPrevPage={() => setPage((prev) => Math.max(1, prev - 1))}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
        onRemoveItem={handleRemoveItem}
        onEditShipping={handleOpenShippingEditModal}
      />

      {selectedOrderForShippingEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={handleCloseShippingEditModal}
          />
          <div className="relative w-full max-w-lg">
            <UpdateShippingAddressForm
              order={selectedOrderForShippingEdit}
              onClose={handleCloseShippingEditModal}
              onSuccess={handleShippingUpdateSuccess}
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default Orders