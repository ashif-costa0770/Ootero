
import { createColumnHelper } from "@tanstack/react-table";
import { Printer, Pencil, Trash } from 'lucide-react'

const columnHelper = createColumnHelper();

export const columns = [
  // Checkbox
  columnHelper.display({
    id: "select",
    cell: () => <input type="checkbox" className="text-gray-700 cursor-pointer" />,
  }),

  // ORDER INFO
  columnHelper.accessor("id", {
    id: "orderInfo",
    header: <div className="text-sm text-gray-700">ORDER INFO.</div>,
    cell: (info) => {
      const row = info.row.original;
      return (
        <div>
          <div className="text-sm text-gray-700">SRN : {row.orderNumber || row.id}</div>
          <div className="text-xs text-gray-500">Sales Date :{" "}
            {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
          </div>
        </div>
      );
    },
  }),

  // ORDER LINES
  columnHelper.display({
    id: "orderLines",
    header: <div className="text-sm text-gray-700">ORDER LINES</div>,
    cell: (info) => {
      const row = info.row.original;
      const line = row.items?.[0];
      return (
        <div>
          <div className="text-sm text-gray-700">{line?.name || "No items"}</div>
          <div className="text-xs text-gray-500">
            {(line?.quantity ?? 0)} x ${line?.price ?? 0} <br />  SKU: {line?.sku || "-"}
          </div>
        </div>
      );
    },
  }),

  // CUSTOMER
  columnHelper.display({
    id: "customer",
    header: <div className="text-sm text-gray-700">CUSTOMER</div>,
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <div className="text-sm text-gray-700">{row.customerName || "N/A"}</div>
          <div className="text-xs text-gray-500">{row.customerPhone || "N/A"}</div>
          <div className="text-xs text-gray-500">{row.customerEmail || "-"}</div>
          <div className="text-xs text-gray-500">{row.billingAddress1 || "-"}</div>
        </div>
      );
    },
  }),

  // SHIPPING
  columnHelper.display({
    id: "shipping",
    header: <div className="text-sm text-gray-700">SHIPPING</div>,
    cell: (info) => {
      const row = info.row.original;
      return (
        <div>
          <div className="text-sm text-gray-700">Postage Service: {row.shippingMethod || "-"}</div>
          <div className="text-xs text-gray-500">
            Postage: ${row.shippingTotal ?? 0}
          </div>
        </div>
      );
    },
  }),

  // DIMENSIONS
  columnHelper.display({
    id: "dimensions",
    header: <div className="text-sm text-gray-700 ">DIMENSIONS</div>,
    cell: (info) => {
      const row = info.row.original;
      const product = row.items?.[0]?.product;
      const d = product?.dimensions || {};
      return (
        <div className="border boder-dashed border-gray-300 text-gray-700 rounded-md p-2 text-xs">
          <div>Width: {d.width ?? "-"} Height: {d.height ?? "-"}</div>
          <div>Length: {d.length ?? "-"} Weight: {product?.weight ?? "-"}</div>
        </div>
      );
    },
  }),

  // TOTAL
  columnHelper.display({
    id: "total",
    header: <div className="text-sm text-gray-700">TOTAL</div>,
    cell: (info) => {
      const row = info.row.original;
      return <div className="text-sm text-gray-700">{row.currency || "AUD"} {row.totalAmount ?? 0}</div>;
    },
  }),

  // ACTIONS
  columnHelper.display({
    id: "actions",
    header: <div className="text-sm text-gray-700">ACTION</div>,
    cell: () => (
      <div className="flex flex-col justify-center">
      <div className="flex gap-2 justify-center text-gray-700 ">
        <button className="hover:text-gray-500 cursor-pointer"><Printer size={16} /></button>
        <button className="hover:text-gray-500 cursor-pointer"><Pencil size={16} /></button>
        <button className="bg-red-100 text-red-500 rounded-full p-1 hover:bg-red-200 hover:text-red-500 cursor-pointer"><Trash size={16} /></button>
      </div>
      <button className="bg-blue-500 text-white rounded p-1 mt-3 text-xs font-medium hover:bg-blue-600 cursor-pointer">Confirm</button>
      </div>
    ),
  }),
];