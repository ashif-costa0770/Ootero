import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forceSyncSchema } from "../../validations/order.validation";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { triggerForceOrderSync } from "../../services/order.api";

const ForceSyncForm = ({ storeId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forceSyncSchema),
    shouldFocusError: false,
    defaultValues: {
      status: "",
      fromDate: "",
      toDate: "",
      orderIds: "",
    },
  });


  const borderClass =
    errors.status || errors.fromDate || errors.toDate || errors.orderIds
      ? "border-red-500"
      : "border-gray-300";

  const handleInvalidSubmit = (formErrors) => {
    const fallback = "At least one field is required";
    const message = formErrors?._errors?.message || fallback;
    toast.error(message);
  };

  const handleSubmitClick = async (data) => {
    try {
      setLoading(true);

      const response = await triggerForceOrderSync(storeId, data);
      if (response.status === 200) {
        const message =
          response?.data?.message ||
          "Force sync orders completed";
        toast.success(message);
        reset();
        onSuccess?.();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to trigger force sync orders";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      {/* Card */}
      <div className="w-full max-w-sm border border-slate-200 rounded-xl p-8 bg-white">
        <div className="text-center mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-blue-700">
            Force Sync Orders
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer"
          >
            <X className="w-5 h-5 inline-block " />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleSubmitClick, handleInvalidSubmit)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Order Ids
            </label>
            <textarea
              rows={3}
              placeholder="e.g. 101, 102, 103"
              {...register("orderIds")}
              className={`w-full border ${borderClass} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.orderIds && (
              <p className="text-red-500 text-sm mt-1">
                {errors.orderIds.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Status</label>
            <select
              {...register("status")}
              className={`w-full border ${borderClass} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              {...register("fromDate")}
              className={`w-full border ${borderClass} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.fromDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fromDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">To Date</label>
            <input
              type="date"
              {...register("toDate")}
              className={`w-full border ${borderClass} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.toDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.toDate.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-md transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" />
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForceSyncForm;
