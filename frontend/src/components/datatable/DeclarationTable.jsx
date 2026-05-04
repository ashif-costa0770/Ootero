const DeclarationTable = () => {
  const data = [
    {
      tariffCode: "123456",
      sku: "85664",
      item: "IC123456",
      qty: 1,
      weight: 2,
    },
  ];

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
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-t border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3">{row.tariffCode}</td>
              <td className="px-4 py-3">{row.sku}</td>
              <td className="px-4 py-3">{row.item}</td>
              <td className="px-4 py-3 text-center">{row.qty}</td>
              <td className="px-4 py-3 text-center">{row.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeclarationTable;
