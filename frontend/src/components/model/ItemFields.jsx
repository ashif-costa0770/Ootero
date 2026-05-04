import { Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors";

export default function ItemFields({ index, register, errors, remove }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold text-lg">Item {index + 1}</h3>
        <button
          type="button"
          onClick={() => remove(index)}
          className="text-red-500 text-sm cursor-pointer"
        >
          {index > 0 ? <Trash2 className="w-4 h-4" /> : ""}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 mt-6">
        {/* Country of Origin */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Country of Origin
          </label>
          <input
            {...register(`items.${index}.countryOfOrigin`)}
            placeholder="Country of Origin"
            className={inputClass}
          />
          {errors.items?.[index]?.countryOfOrigin && (
            <p className="text-red-500 text-xs mt-1">
              {errors.items[index].countryOfOrigin.message}
            </p>
          )}
        </div>

        {/* Tariff Code */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Tariff Code
          </label>
          <input
            {...register(`items.${index}.tariffCode`)}
            placeholder="Tariff Code"
            className={inputClass}
          />
          {errors.items?.[index]?.tariffCode && (
            <p className="text-red-500 text-xs mt-1">
              {errors.items[index].tariffCode.message}
            </p>
          )}
        </div>
        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Description <span className="text-red-500">*</span>
          </label>
          <input
            {...register(`items.${index}.description`)}
            placeholder="Description"
            className={inputClass}
          />
          {errors.items?.[index]?.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.items[index].description.message}
            </p>
          )}
        </div>

        {/* Tariff Concession */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Tariff Concession
          </label>
          <input
            {...register(`items.${index}.tariffConcession`)}
            placeholder="Tariff Concession"
            className={inputClass}
          />
          {errors.items?.[index]?.tariffConcession && (
            <p className="text-red-500 text-xs mt-1">
              {errors.items[index].tariffConcession.message}
            </p>
          )}
        </div>

        {/* SKU */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            SKU
          </label>
          <input
            {...register(`items.${index}.sku`)}
            placeholder="SKU"
            className={inputClass}
          />
          {errors.items?.[index]?.sku && (
            <p className="text-red-500 text-xs mt-1">
              {errors.items[index].sku.message}
            </p>
          )}
        </div>

        {/* Reference */}
            <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Reference
          </label>
          <input
            {...register(`items.${index}.reference`)}
            placeholder="Reference"
            className={inputClass}
          />
          {errors.items?.[index]?.reference && (
            <p className="text-red-500 text-xs mt-1">
              {errors.items[index].reference.message}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            placeholder="Quantity"
            className={inputClass}
          />
          {errors.items?.[index]?.quantity && (
            <p className="text-red-500 text-xs mt-1">
              {errors.items[index].quantity.message}
            </p>
          )}
        </div>
        {/* Unit Value */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Unit Value (AUD) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register(`items.${index}.unitValue`, { valueAsNumber: true })}
            placeholder="Unit Value (AUD)"
            className={inputClass}
          />
          {errors.items?.[index]?.unitValue && (
            <p className="text-red-500 text-xs mt-1">
              {errors.items[index].unitValue.message}
            </p>
          )}
        </div>
        {/* Weight */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Weight (kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register(`items.${index}.weight`, { valueAsNumber: true })}
            placeholder="Weight (kg)"
            className={inputClass}
          />
          {errors.items?.[index]?.weight && (
            <p className="text-red-500 text-xs mt-1">
              {errors.items[index].weight.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
