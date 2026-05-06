// components/ShippingRuleForm.jsx
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingRuleSchema } from "../../validations/store.validation";
import {
  getAuspostShippingRules,
  updateAuspostShippingRules,
} from "../../services/store.api";
import { toast } from "sonner";
const ShippingRuleForm = ({ storeId }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shippingRuleSchema),
    defaultValues: {
      rules: [{ ruleName: "", postageService: "", shippingMethod: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rules",
  });

  //! Fetch auspost shipping rules
  useEffect(() => {
    const fetchShippingRules = async () => {
      try {
        setLoading(true);
        const response = await getAuspostShippingRules(storeId);
        const data = response.data.data;
        console.log("AUSPOST SHIPPING RULES:", data);
        reset({ rules: data });
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Failed to fetch auspost shipping rules";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchShippingRules();
  }, [storeId, reset]);

  //! Handle submit
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await updateAuspostShippingRules(storeId, data);
      if (response.status === 200) {
        toast.success(
          response?.data?.message ||
            "Auspost shipping rules updated successfully",
        );
      }
      const saved = response.data.data || {};
      console.log("SAVED:", saved);
      reset(saved);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to update auspost shipping rules";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };                       

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-hidden rounded-lg border border-gray-200 bg-white font-sans text-gray-800 shadow-sm"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-[#e0e0e0] bg-white px-4 py-3 text-left font-semibold text-gray-700 w-[22%]">
                Rule Name
              </th>
              <th className="border border-[#e0e0e0] bg-white px-4 py-3 text-left font-semibold text-gray-700 w-[28%]">
                Postage Service
              </th>
              <th className="border border-[#e0e0e0] bg-white px-4 py-3 text-left font-semibold text-gray-700 w-[28%]">
                Shipping Method
              </th>
              <th className="border border-[#e0e0e0] bg-white px-4 py-3 text-center font-semibold text-gray-700 w-[16%]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td className="border border-[#e0e0e0] align-top px-4 py-3 text-gray-600">
                  <input
                    {...register(`rules.${index}.ruleName`)}
                    placeholder="Enter Rule Name"
                    className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.rules?.[index]?.ruleName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.rules[index].ruleName.message}
                    </p>
                  )}
                </td>
                <td className="border border-[#e0e0e0] align-top px-4 py-3 text-gray-600">
                  <input
                    {...register(`rules.${index}.postageService`)}
                    placeholder="Enter Postage Service (add multiple separated by commas)"
                    className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.rules?.[index]?.postageService && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.rules[index].postageService.message}
                    </p>
                  )}
                </td>
                <td className="border border-[#e0e0e0] align-top px-4 py-3 text-gray-600">
                  <select
                    {...register(`rules.${index}.shippingMethod`)}
                    className="w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Choose Shipping Method</option>
                    <option value="International STANDARD/PACK & TRACK">
                      International STANDARD/PACK & TRACK
                    </option>
                    <option value="APGL NZ EXPRESS W/SIGNATURE">APGL NZ EXPRESS W/SIGNATURE</option>
                    <option value="APGL NZ EXPRESS">APGL NZ EXPRESS</option>
                    <option value="APGL WW WITH SIGNATURE">APGL WW WITH SIGNATURE</option>
                    <option value="APGL WW">APGL WW</option>
                    <option value="APGL CN EXPRESS WITH SIGNATURE">APGL CN EXPRESS WITH SIGNATURE</option>
                    <option value="APGL CN WITH SIGNATURE">APGL CN WITH SIGNATURE</option>
                    <option value="International EXPRESS MERCH">International EXPRESS MERCH</option>
                    <option value="PARCEL POST + SIGNATURE">PARCEL POST + SIGNATURE</option>
                    <option value="EXPRESS POST + SIGNATURE">EXPRESS POST + SIGNATURE</option>
                  
                  </select>
                  {errors.rules?.[index]?.shippingMethod && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.rules[index].shippingMethod.message}
                    </p>
                  )}
                </td>
                <td className="border border-[#e0e0e0] px-4 py-3 text-center align-middle">
                  <button
                    type="button"
                    onClick={ () => remove(index)}
                    disabled={fields.length === 1}
                    className="cursor-pointer inline-flex min-w-[5.5rem] items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 border-t border-[#e0e0e0] px-6 py-4">
        <button
          type="button"
          onClick={() =>
            append({
              ruleName: "",
              postageService: "",
              shippingMethod: "",
            })
          }
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Add Row
        </button>
        <button
          type="submit"
          className="cursor-pointer rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ShippingRuleForm;
