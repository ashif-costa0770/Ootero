import React from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { addStoreSchema } from "../../validations/store.validation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

const AddStoreModal = ({ isOpen, onClose }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addStoreSchema),
    defaultValues: {
      name: "",
      platform: "woocommerce",
      storeUrl: "",
      consumerKey: "",
      consumerSecret: "",
    },
  });

  const handleSubmitClick = (data) => {
    toast.success("Store added successfully");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl px-6 py-5 relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Add New Store</h2>
          <button
            className="cursor-pointer rounded-full p-2 hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="space-y-4"
        >
          {/* Source of Store */}
          <div>
            <label className="block text-[15px] font-semibold mb-2 text-gray-700">
              Source of Store
            </label>
            <div className="flex gap-4">
              {["woocommerce", "ebay", "shopify"].map((p) => (
                <label
                  key={p}
                  title={p === "shopify" || p === "ebay" ? "Coming soon" : ""}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer font-medium px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <input 
                    type="radio" 
                    value={p} 
                    title={p === "shopify" || p === "ebay" ? "Coming soon" : ""}
                    disabled={p === "shopify" || p === "ebay"}
                    {...register("platform")}
                    className="accent-blue-600 focus:ring-blue-500"
                  />
                  <span className="capitalize">{p}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Store name */}
          <div>
            <label className="block text-[15px] font-semibold mb-1 text-gray-700">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter store name"
              {...register("name")}
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${errors.name ? "border-red-400" : "border-gray-300 focus:border-blue-500"}`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Store URL */}
          <div>
            <label className="block text-[15px] font-semibold mb-1 text-gray-700">
              Store URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              placeholder="Enter store URL"
              {...register("storeUrl")}
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${errors.storeUrl ? "border-red-400" : "border-gray-300 focus:border-blue-500"}`}
            />
            {errors.storeUrl && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.storeUrl.message}
              </p>
            )}
          </div>

          {/* Consumer Key */}
          <div>
            <label className="block text-[15px] font-semibold mb-1 text-gray-700">
              Consumer Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter consumer key"
              {...register("consumerKey")}
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${errors.consumerKey ? "border-red-400" : "border-gray-300 focus:border-blue-500"}`}
            />
            {errors.consumerKey && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.consumerKey.message}
              </p>
            )}
          </div>

          {/* Consumer Secret */}
          <div>
            <label className="block text-[15px] font-semibold mb-1 text-gray-700">
              Consumer Secret <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter consumer secret"
              {...register("consumerSecret")}
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${errors.consumerSecret ? "border-red-400" : "border-gray-300 focus:border-blue-500"}`}
            />
            {errors.consumerSecret && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.consumerSecret.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border border-gray-300 rounded-lg text-gray-600 text-sm px-5 py-2 font-medium hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Close
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;
