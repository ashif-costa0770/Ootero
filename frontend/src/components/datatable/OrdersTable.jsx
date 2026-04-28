import DataTable from "./DataTable";
import { columns } from "./orders.columns.jsx";

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
  onRemoveItem,
  onEditShipping,
  onCreateLabel,
}) {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <DataTable
        data={orders}
        columns={columns({ onRemoveItem, onEditShipping, onCreateLabel })}
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