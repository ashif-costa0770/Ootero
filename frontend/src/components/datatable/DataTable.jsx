import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import SearchInput from "../common/SearchInput";
import {  Loader2, Package, RefreshCw } from "lucide-react";
import { triggerOrderSync } from "../../services/order.api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
export default function DataTable({
  data,
  columns,
  error,
  pagination,
  onNextPage,
  onPrevPage,
}) {
  const { storeId } = useParams();
  const [loading, setLoading] = useState(false);
  const handleSync = async () => {
    try {
      setLoading(true);
      const response = await triggerOrderSync(storeId);
      const message = response?.data?.message || "Order sync triggered successfully";
      toast.success(message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
        const message = error?.response?.data?.message || "Failed to trigger order sync";
      toast.error(message);
    }
  };
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" size={20} />
        Syncing orders...
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
        <div className="flex items-center gap-2">
          <button onClick={handleSync} className="flex cursor-pointer items-center gap-2 text-sm border border-blue-500 text-blue-500 px-4 py-1.5 rounded-md">
            <RefreshCw size={16} />
            Sync from WooCommerce
          </button>
          <button className="flex cursor-pointer items-center gap-2 text-sm bg-blue-500 text-white px-4 py-1.5 rounded-md">
            <Package size={16} />
            Create Order
          </button>
        </div>
        <SearchInput placeholder="Search..." />
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} orders)
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevPage}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1.5 text-gray-800 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={onNextPage}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1.5 text-sm text-gray-800 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
