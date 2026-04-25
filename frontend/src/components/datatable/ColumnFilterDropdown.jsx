import React from "react";

const ColumnFilterDropdown = ({
  open,
  options,
  tempVisibility,
  onTempChange,
  onReset,
  onApply,
}) => {
  if (!open) return null;

  const allChecked = options.every((opt) => !!tempVisibility[opt.id]);
  const selectedCount = options.filter((opt) => tempVisibility[opt.id]).length;

  return (
    <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-gray-200 bg-white shadow-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        AVAILABLE COLUMNS
      </h3>

      <div className="space-y-3 max-h-72 overflow-auto pr-1">
        {/* All checkboxes */}
        <label className="flex items-center gap-2 text-sm font-medium text-gray-800 cursor-pointer">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => {
              const checked = e.target.checked;
              onTempChange((prev) => {
                const next = { ...prev };
                options.forEach((opt) => {
                  next[opt.id] = checked;
                });
                return next;
              });
            }}
            className="h-4 w-4 rounded border-gray-300"
          />
          All
        </label>
        {/* Individual checkboxes */}
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={!!tempVisibility[option.id]}
              onChange={(e) =>
                onTempChange((prev) => ({
                  ...prev,
                  [option.id]: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            {option.label}
          </label>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer flex-1 border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          RESET
        </button>
        <button
          type="button"
          onClick={onApply}
          disabled={selectedCount === 0}
          className="cursor-pointer flex-1 rounded-md py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          APPLY
        </button>
      </div>
    </div>
  );
};

export default ColumnFilterDropdown;
