import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fromAddressSchema } from "../../validations/order.validation";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";

const normalizeCountry = (value) => {
  if (!value) return "Australia";
  const v = String(value).trim().toLowerCase();
  if (v === "au" || v === "australia") return "Australia";
  if (v === "us" || v === "usa" || v === "united states")
    return "United States";
  if (v === "uk" || v === "gb" || v === "united kingdom")
    return "United Kingdom";
  if (v === "in" || v === "india") return "India";
  return value;
};

const FromAddressForm = ({ order, onSubmit, submitLabel = "Save" }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fromAddressSchema),
    shouldFocusError: false,
    defaultValues: order
      ? {
          addressLine1: order?.shippingAddress1 || "",
          addressLine2: order?.shippingAddress2 || "",
          suburb: order?.shippingCity || "",
          state: order?.shippingState || "",
          postcode: order?.shippingPostcode || "",
          country: normalizeCountry(order?.shippingCountry),
        }
      : {},
  });

  useEffect(() => {
    if (!order) return;
    reset({
      addressLine1: order?.shippingAddress1 || "",
      addressLine2: order?.shippingAddress2 || "",
      suburb: order?.shippingCity || "",
      state: order?.shippingState || "",
      postcode: order?.shippingPostcode || "",
      country: normalizeCountry(order?.shippingCountry),
    });
  }, [order, reset]);

  const submitHandler = (values) => {
    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Address line 1 <span className="text-red-500">*</span>
          </label>
          <input {...register("addressLine1")} className={inputClass} />
          {errors.addressLine1 && (
            <p className="mt-1 text-xs text-red-500">
              {errors.addressLine1.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Address line 2 
          </label>
          <input {...register("addressLine2")} className={inputClass} />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">City <span className="text-red-500">*</span></label>
          <input {...register("suburb")} className={inputClass} />
          {errors.suburb && (
            <p className="mt-1 text-xs text-red-500">{errors.suburb.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">State <span className="text-red-500">*</span></label>
          <input {...register("state")} className={inputClass} />
          {errors.state && (
            <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Postcode <span className="text-red-500">*</span></label>
          <input {...register("postcode")} className={inputClass} />
          {errors.postcode && (
            <p className="mt-1 text-xs text-red-500">
              {errors.postcode.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Country/Region <span className="text-red-500">*</span>  
          </label>
          <select {...register("country")} className={inputClass}>
            <option value="Australia">Australia</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="India">India</option>
          </select>
          {errors.country && (
            <p className="mt-1 text-xs text-red-500">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default FromAddressForm;
