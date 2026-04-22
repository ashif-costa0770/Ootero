import React, { useEffect, useState } from "react";
import ImageLogo from "../common/ImageLogo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { connectStoreSchema } from "../../validations/store.validation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { connectStore } from "../../services/store.api";
import { useNavigate } from "react-router-dom";

const StoreForm = ({ selectedPlatform = "woocommerce" }) => {
  const [loading, setLoading] = useState(false);
  const platformLabel =
    selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(connectStoreSchema),
    shouldFocusError: false,
    defaultValues: {
      name: "",
      platform: selectedPlatform,
      storeUrl: "",
      consumerKey: "",
      consumerSecret: "",
    },
  });

  useEffect(() => {
    setValue("platform", selectedPlatform, { shouldValidate: true });
  }, [selectedPlatform, setValue]);

  const borderClass =
    errors.name ||
    errors.storeUrl ||
    errors.consumerKey ||
    errors.consumerSecret
      ? "border-red-500"
      : "border-gray-300";

  const handleSubmitClick = async (data) => {
    try {
      setLoading(true);
      const payload = { ...data, platform: selectedPlatform };
      const response = await connectStore(payload);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Store connected successfully");
        reset();
        navigate(`/store-details/${response.data.data.id}`);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to connect store";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center mt-8 px-4 sm:px-8 md:px-12 lg:px-16 w-full md:w-4/5 lg:w-1/2 mx-auto">
      {/* Logo */}
      <div className="text-center w-1/2 ">
        <ImageLogo />
      </div>
      {/* Heading */} 
      <h2 className="text-4xl font-bold text-center pt-6  pb-8">Set Up Store Connection</h2>

      {/* Card */}
      <form
        onSubmit={handleSubmit(handleSubmitClick)}
        className="space-y-7 w-full"
      >
        <input type="hidden" {...register("platform")} />
        <div>
          <label className="block text-sm text-gray-800 font-medium mb-1">
            Store Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter store name"
            {...register("name")}
            className={`w-full border ${borderClass} rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-800 font-medium mb-1">
            {platformLabel} website URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            placeholder={`Enter ${platformLabel} website URL`}
            {...register("storeUrl")}
            className={`w-full border ${borderClass} rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.storeUrl && (
            <p className="text-red-500 text-sm mt-1">
              {errors.storeUrl.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-800 font-medium mb-1">
            {platformLabel} Consumer Key <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={`Enter ${platformLabel} Consumer Key`}
            {...register("consumerKey")}
            className={`w-full border ${borderClass} rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.consumerKey && (
            <p className="text-red-500 text-sm mt-1">
              {errors.consumerKey.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-800 font-medium mb-1">
            {platformLabel} Consumer Secret <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={`Enter ${platformLabel} Consumer Secret`}
            {...register("consumerSecret")}
            className={`w-full border ${borderClass} rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.consumerSecret && (
            <p className="text-red-500 text-sm mt-1">
              {errors.consumerSecret.message}
            </p>
          )}
        </div>
        <div className="text-center w-1/2 mx-auto">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer text-center w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 inline-block mr-2 animate-spin" />
          ) : (
            "Connect"
          )}
        </button>
        </div>
      </form>
    </div>
  );
};

export default StoreForm;
