import { useState, useEffect } from "react";
import { getAuspostDeclarations } from "../../services/store.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DeclarationTable = ({ storeId, refreshKey }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAuspostDeclarations(storeId);
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        console.log("DECLARATIONS:", data);
        setData(data);
      } catch (error) {
        const message = error?.response?.data?.message || "Failed to fetch declarations";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeId, refreshKey]);

  // Flatten the data
  const rows = data?.flatMap((declaration, declarationIndex) =>
    (declaration.items ?? []).map((item, itemIndex) => ({
      id: `${declarationIndex}-${itemIndex}`,
      tariffCode: item.tariffCode || "-",
      sku: item.sku || "-",
      item: item.description || "-",
      qty: item.quantity ?? "-",
      weight: item.weight ?? "-",
    })),
  );

  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm text-gray-700">
        {/* Header */}
        <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Tariff Code</th>
            <th className="px-4 py-3 text-left">SKU</th>
            <th className="px-4 py-3 text-left">Items</th>
            <th className="px-4 py-3 text-center">Qty</th>
            <th className="px-4 py-3 text-center">Unit Weight (kg)</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {rows.length === 0 ? (
            <tr className="border-t border-gray-200">
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No declaration items found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{row.tariffCode}</td>
                <td className="px-4 py-3">{row.sku}</td>
                <td className="px-4 py-3">{row.item}</td>
                <td className="px-4 py-3 text-center">{row.qty}</td>
                <td className="px-4 py-3 text-center">{row.weight}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeclarationTable;
