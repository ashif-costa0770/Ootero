import { useState, useEffect } from "react";
import { getAuspostDeclarations } from "../../services/store.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DeclarationTable = ({ storeId, refreshKey }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  //! Fetch declarations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAuspostDeclarations(storeId);
        const data = response.data.data || null;
        setData(data);
      } catch (error) {
        const message =
          error?.response?.data?.message || "Failed to fetch declarations";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeId, refreshKey]);

  // Flatten the data
  const rows = data?.items ?? null;
  if (rows === null)
    return (
      <div className="text-center text-gray-500">
        No declaration items found.
      </div>
    );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm text-gray-700">
        {/* Header */}
        <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left ps-8">Tariff Code</th>
            <th className="px-4 py-3 text-left">SKU</th>
            <th className="px-4 py-3 text-left">Item</th>
            <th className="px-4 py-3 text-center">Qty</th>
            <th className="px-4 py-3 text-center">Unit Weight (kg)</th>
          </tr>
        </thead>
        {/* Body */}
        <tbody>
          {rows?.map((row, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                  <td className="px-4 py-3 ps-8">{row?.tariffCode}</td>
                <td className="px-4 py-3">{row?.sku}</td>
                <td className="px-4 py-3">{row?.description}</td>
                <td className="px-4 py-3 text-center">{row?.quantity}</td>
                <td className="px-4 py-3 text-center">{row?.weight}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeclarationTable;
