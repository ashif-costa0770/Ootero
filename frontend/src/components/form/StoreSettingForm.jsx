import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSettingSchema } from "../../validations/store.validation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const StoreSettingForm = ({ store }) => {
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(storeSettingSchema),
    defaultValues: {
      name: store?.name || "",
      storeUrl: store?.storeUrl || store?.url || "",
      consumerKey: store?.consumerKey || "",
      consumerSecret: store?.consumerSecret || "",
    },
  });

  const handleSubmitClick = (data) => {
    toast.success("Store settings updated successfully");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleSubmitClick)} className="space-y-4">
        {/* Store Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Store name
          </label>
          <input
            {...register("name")}
            className={`w-full text-sm text-gray-700 border-1 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition ${
              errors.name
                ? "border-red-400"
                : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            WooCommerce website URL
          </label>
          <input
            {...register("storeUrl")}
            className={`w-full border-2 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition ${
              errors.storeUrl
                ? "border-red-400 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
          />
          {errors.storeUrl && (
            <p className="text-red-500 text-xs mt-1">
              {errors.storeUrl.message}
            </p>
          )}
        </div>

        {/* Consumer Key */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            WooCommerce Consumer Key
          </label>
          <div className="relative flex items-center">
            <input
              type={showKey ? "text" : "password"}
              {...register("consumerKey")}
              className="w-full border-2 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:border-blue-500 transition border-gray-300 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              tabIndex={-1}
              aria-label={showKey ? "Hide consumer key" : "Show consumer key"}
            >
              {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Consumer Secret */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            WooCommerce Consumer Secret
          </label>
          <div className="relative flex items-center">
            <input
              type={showSecret ? "text" : "password"}
              {...register("consumerSecret")}
              className="w-full border-2 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:border-blue-500 transition border-gray-300 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              tabIndex={-1}
              aria-label={
                showSecret ? "Hide consumer secret" : "Show consumer secret"
              }
            >
              {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            className="cursor-pointer bg-blue-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-blue-700 transition active:scale-95 shadow"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreSettingForm;
