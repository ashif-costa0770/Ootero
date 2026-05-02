// components/ShippingRuleForm.jsx
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingRuleSchema } from "../../validations/store.validation";

const ShippingRuleForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shippingRuleSchema),
    defaultValues: {
      rules: [
        { ruleName: "", postageService: "", shippingMethod: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rules",
  });

  const onSubmit = (data) => {
    console.log("SUBMIT:", data.rules);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-300 rounded-lg ">

      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 py-4 px-10 text-sm font-medium text-gray-600">
        <div>Rule Name</div>
        <div>Postage Service</div>
        <div>Shipping Method</div>
        <div>Action</div>
      </div>

      {/* Rows */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex justify-between items-center border-b border-gray-200 py-4 px-10 text-sm font-medium text-gray-600"
        >
          {/* Rule Name */}
          <div>
            <input
              {...register(`rules.${index}.ruleName`)}
              placeholder="Enter Rule Name"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            {errors.rules?.[index]?.ruleName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.rules[index].ruleName.message}
              </p>
            )}
          </div>

          {/* Postage Service */}
          <div>
            <input
              {...register(`rules.${index}.postageService`)}
              placeholder="Enter Postage Service"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            {errors.rules?.[index]?.postageService && (
              <p className="text-red-500 text-xs mt-1">
                {errors.rules[index].postageService.message}
              </p>
            )}
          </div>

          {/* Shipping Method */}
          <div>
            <select
              {...register(`rules.${index}.shippingMethod`)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Choose Shipping Method</option>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
            </select>

            {errors.rules?.[index]?.shippingMethod && (
              <p className="text-red-500 text-xs mt-1">
                {errors.rules[index].shippingMethod.message}
              </p>
            )}
          </div>

          {/* Action */}
          <div>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              className="bg-red-500 text-white px-3 py-2 rounded text-sm disabled:opacity-50 cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={() =>
            append({
              ruleName: "",
              postageService: "",
              shippingMethod: "",
            })
          }
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer"
        >
          Add Row
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm cursor-pointer"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ShippingRuleForm;