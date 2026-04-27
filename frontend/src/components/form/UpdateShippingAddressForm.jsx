import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { updateShippingAddress } from "../../services/order.api";
import { updateShippingAddressSchema } from "../../validations/order.validation";

const UpdateShippingAddressForm = ({ order, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateShippingAddressSchema),
    defaultValues: {
      shippingAddress1: "",
      shippingAddress2: "",
      shippingCity: "",
      shippingState: "",
      shippingPostcode: "",
    },
  });

  useEffect(() => {
    if (!order) return;
    reset({
      shippingAddress1: order.shippingAddress1 || "",
      shippingAddress2: order.shippingAddress2 || "",
      shippingCity: order.shippingCity || "",
      shippingState: order.shippingState || "",
      shippingPostcode: order.shippingPostcode || "",
    });
  }, [order, reset]);

  const onSubmit = async (values) => {
    if (!order?.id) return;

    try {
      setLoading(true);
      const response = await updateShippingAddress(order.id, values);
      toast.success(
        response?.data?.message || "Shipping address updated successfully",
      );
      onSuccess?.();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update shipping address";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Update Shipping Address
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Shipping Address 1
          </label>
          <input
            type="text"
            {...register("shippingAddress1")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.shippingAddress1 && (
            <p className="mt-1 text-xs text-red-500">
              {errors.shippingAddress1.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Shipping Address 2
          </label>
          <input
            type="text"
            {...register("shippingAddress2")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.shippingAddress2 && (
            <p className="mt-1 text-xs text-red-500">
              {errors.shippingAddress2.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-700">
              Shipping City
            </label>
            <input
              type="text"
              {...register("shippingCity")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.shippingCity && (
              <p className="mt-1 text-xs text-red-500">
                {errors.shippingCity.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-700">
              Shipping State
            </label>
            <input
              type="text"
              {...register("shippingState")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.shippingState && (
              <p className="mt-1 text-xs text-red-500">
                {errors.shippingState.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Shipping Postcode
          </label>
          <input
            type="text"
            {...register("shippingPostcode")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.shippingPostcode && (
            <p className="mt-1 text-xs text-red-500">
              {errors.shippingPostcode.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateShippingAddressForm;
