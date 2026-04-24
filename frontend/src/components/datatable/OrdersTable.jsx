import DataTable from "./DataTable";
import { columns } from "./orders.columns.jsx";
// import { orders } from "./orders.data.js";

export default function OrdersTable({
  orders,
  loading,
  error,
  pagination,
  onNextPage,
  onPrevPage,
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
      />
    </div>
  );
}