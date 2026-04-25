import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderFilter from '../../components/admin/OrderFilter'
import OrdersTable from '../../components/datatable/OrdersTable'
import { getOrders } from '../../services/order.api'

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


  useEffect(() => {
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
      } catch (error) {
        setError(error.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [storeId, page, limit, search, status]);

  useEffect(() => {
    setPage(1);
  }, [storeId, statusKey]);

  return (
    <div className='flex flex-col gap-4 p-4  bg-gray-100'>
      {/* Filter section */}
      <OrderFilter
        status={status}
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
      />


    </div>
  )
}

export default Orders