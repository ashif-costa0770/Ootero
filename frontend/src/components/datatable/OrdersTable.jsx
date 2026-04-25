import DataTable from "./DataTable";
import { columns } from "./orders.columns.jsx";
// import { orders } from "./orders.data.js";

export default function OrdersTable({
  orders,
  loading,
  error,
  search,
  onSearchChange,
  pagination,
  onNextPage,
  onPrevPage,
  onPageChange,
  onLimitChange,
}) {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <DataTable
        data={orders}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        search={search}
        onSearchChange={onSearchChange}
      />
    </div>
  );
}