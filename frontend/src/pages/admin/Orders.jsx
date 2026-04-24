import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderFilter from '../../components/admin/OrderFilter'
import OrdersTable from '../../components/datatable/OrdersTable'
import { getOrders } from '../../services/order.api'
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { storeId } = useParams();

  useEffect(() => {
      const fetchOrders = async () => {
        if (!storeId) {
          setError("Store ID is missing from URL.");
          return;
        }
        try {
        setLoading(true);
        setError(null);
        const res = await getOrders(storeId, { page, limit: 20 });
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
  }, [storeId, page]);

  return (
    <div className='flex flex-col gap-4 p-4  bg-gray-100'>
      {/* Filter section */}
      <OrderFilter />

      {/* Table section */}
      <OrdersTable
        orders={orders}
        loading={loading}
        error={error}
        pagination={pagination}
        onNextPage={() => setPage((prev) => prev + 1)}
        onPrevPage={() => setPage((prev) => Math.max(1, prev - 1))}
      />


    </div>
  )
}

export default Orders