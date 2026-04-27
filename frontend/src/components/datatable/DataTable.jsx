import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import SearchInput from "../common/SearchInput";
import {
  Loader2,
  Package,
  RefreshCw,
  Funnel,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { triggerOrderSync } from "../../services/order.api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import ColumnFilterDropdown from "./ColumnFilterDropdown";
import ForceSyncForm from "../form/ForceSyncForm";

const columnOptions = [
  { id: "orderInfo", label: "Order Info" },
  { id: "orderLines", label: "Order lines" },
  { id: "customer", label: "Customer" },
  { id: "shipping", label: "Shipping" },
  { id: "dimensions", label: "Dimensions" },
  { id: "total", label: "Total Spent" },
  { id: "actions", label: "Actions" },
];

export default function DataTable({
  data,
  search,
  onSearchChange,
  columns,
  error,
  pagination,
  onNextPage,
  onPrevPage,
  onPageChange,
  onLimitChange,
}) {
  const { storeId } = useParams();
  const [loading, setLoading] = useState(false);
  const [forceSyncOpen, setForceSyncOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    select: true,
    orderInfo: true,
    orderLines: true,
    customer: true,
    shipping: true,
    dimensions: true,
    total: true,
    actions: true,
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [tempVisibility, setTempVisibility] = useState(columnVisibility);

  const handleOpenColumnMenu = () => {
    setTempVisibility(columnVisibility); // copy current applied state
    setShowColumnMenu((prev) => !prev);
  };

  const handleApplyColumns = () => {
    setColumnVisibility(tempVisibility);
    setShowColumnMenu(false);
  };

  const handleResetColumns = () => {
    const allVisible = columnOptions.reduce((acc, col) => {
      acc[col.id] = true;
      return acc;
    }, {});

    // apply immediately to table
    setColumnVisibility((prev) => ({ ...prev, ...allVisible }));

    // keep temp in sync for next open
    setTempVisibility((prev) => ({ ...prev, ...allVisible }));

    // close dropdown
    setShowColumnMenu(false);
  };

  //! Sync orders from WooCommerce
  const handleSync = async () => {
    try {
      setLoading(true);
      const response = await triggerOrderSync(storeId);
      const message =
        response?.data?.message || "Order sync triggered successfully";
      toast.success(message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const message =
        error?.response?.data?.message || "Failed to trigger order sync";
      toast.error(message);
    }
  };

  //! React Table
  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const getPaginationItems = (currentPage, totalPages) => {
    if (!totalPages || totalPages <= 1) {
      return [1];
    }

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="relative flex items-center justify-center mb-4">
          <span className="absolute inline-flex h-20 w-20 rounded-full bg-blue-100 opacity-80 animate-ping" />
          <Loader2 className="animate-spin text-blue-500" size={48} />
        </div>
        <div className="text-lg font-semibold text-gray-700 mb-2">
          Syncing Orders...
        </div>
        <div className="text-gray-500 text-sm mb-6 max-w-xs text-center">
          Please wait while we fetch the latest orders from WooCommerce. This
          may take a moment depending on the number of orders to sync.
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Loader2 size={16} className="animate-spin" />
          Fetching new data...
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        Error: {error}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {/* Top bar options */}
      <div className="flex items-center justify-between">
        {/* Sync and create order */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setForceSyncOpen(true)}
            className="flex cursor-pointer items-center gap-2 text-sm border border-blue-500 text-blue-500 px-4 py-1.5 rounded-md hover:bg-slate-700 hover:border-slate-600 hover:text-white transition-all duration-400"
          >
            <RefreshCw size={16} />
            Force Sync from WooCommerce
          </button>
          <button
            onClick={handleSync}
            className="flex cursor-pointer items-center gap-2 text-sm border border-blue-500 text-blue-500 px-4 py-1.5 rounded-md hover:bg-slate-700 hover:border-slate-600 hover:text-white transition-all duration-400"
          >
            <RefreshCw size={16} />
            Sync from WooCommerce
          </button>
          <button className="flex cursor-pointer items-center gap-2 text-sm bg-blue-500 text-white px-4 py-2 rounded-md  hover:bg-blue-600">
            <Package size={16} />
            Create Order
          </button>
        </div>
        {/* Search and column filter */}
        <div className="relative flex items-center gap-2">
          <SearchInput
            placeholder="Search..."
            value={search}
            onChange={onSearchChange}
          />
          <button
            type="button"
            onClick={handleOpenColumnMenu}
            className="cursor-pointer h-[36px] w-[36px] rounded-md bg-gray-700 text-white flex items-center justify-center hover:bg-gray-800"
          >
            <Funnel size={18} />
          </button>

          <ColumnFilterDropdown
            open={showColumnMenu}
            options={columnOptions}
            tempVisibility={tempVisibility}
            onTempChange={setTempVisibility}
            onReset={handleResetColumns}
            onApply={handleApplyColumns}
          />
        </div>
      </div>
      <table className="w-full border-collapse">
        {/* HEADER */}
        <thead className="bg-gray-200 ">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-3 text-left text-sm text-gray-700 font-medium"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* BODY */}
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500"
              >
                No orders found.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-200">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} orders)
          </div>
          <div className="inline-flex items-center overflow-hidden rounded-xl py-1 border border-gray-300 bg-white">
            <button
              type="button"
              onClick={onPrevPage}
              disabled={!pagination.hasPrevPage}
              className="flex items-center border-r border-gray-300 px-1 py-1 text-xs font-medium text-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 hover:bg-gray-50 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {getPaginationItems(pagination.page, pagination.totalPages).map(
              (item, index) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="border-r border-gray-300 px-1 py-1 text-xs text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${item}`}
                    type="button"
                    onClick={() => onPageChange?.(item)}
                    className={`min-w-8 border-r border-gray-300 px-1 py-1 text-xs font-semibold cursor-pointer ${
                      pagination.page === item
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ),
            )}
            <button
              type="button"
              onClick={onNextPage}
              disabled={!pagination.hasNextPage}
              className="flex items-center px-1 py-1 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 hover:bg-gray-50 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <label htmlFor="limit-select" className="text-sm text-gray-500">
              Show
            </label>
            <select
              id="limit-select"
              value={pagination.limit || 20}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
              className="h-8 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-blue-400"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {forceSyncOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            // onClick={() => setForceSyncOpen(false)}
          />
          <div className="relative w-full max-w-lg">
            <ForceSyncForm
              storeId={storeId}
              onSuccess={() => {
                setForceSyncOpen(false);
                // optional: call refetch function here if available
              }}
              onClose={() => setForceSyncOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
