import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSettingSchema } from "../../validations/store.validation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { updateStoreSettings } from "../../services/store.api";

const StoreSettingForm = ({ store }) => {
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [baseKey, setBaseKey] = useState("");
  const [baseSecret, setBaseSecret] = useState("");
  const [keySuffix, setKeySuffix] = useState("");
  const [secretSuffix, setSecretSuffix] = useState("");
  const [keyMode, setKeyMode] = useState("masked");
  const [secretMode, setSecretMode] = useState("masked");
  const [newKey, setNewKey] = useState("");
  const [newSecret, setNewSecret] = useState("");
  const [loading, setLoading] = useState(null);

  const MIN_TOGGLE_LOADING_MS = 1200; //for smooth transition

  //! useForm to handle form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(storeSettingSchema),
    defaultValues: {
      name: store?.name || "",
      storeUrl: store?.storeUrl || store?.url || "",
    },
  });

  //! useEffect to set default values
  useEffect(() => {
    setBaseKey(store?.consumerKey || "");
    setBaseSecret(store?.consumerSecret || "");
    setKeySuffix("");
    setSecretSuffix("");
    setKeyMode("masked");
    setSecretMode("masked");
    setNewKey("");
    setNewSecret("");
    reset({
      name: store?.name || "",
      storeUrl: store?.storeUrl || store?.url || "",
    });
  }, [store, reset]);

  //! handle key change
  const handleKeyChange = (e) => {
    const input = e.target.value;

    if (keyMode === "replaced") {
      setNewKey(input);
      return;
    }

    if (input.length < 6) {
      setKeyMode("replaced");
      setNewKey("");
    } else {
      setKeySuffix(input.slice(6));
    }
  };

  //! Handle secret change
  const handleSecretChange = (e) => {
    const input = e.target.value;

    if (secretMode === "replaced") {
      setNewSecret(input);
      return;
    }

    if (input.length < 6) {
      setSecretMode("replaced");
      setNewSecret("");
    } else {
      setSecretSuffix(input.slice(6));
    }
  };

  //! Display key and secret
  const keyDisplayValue =
    keyMode === "replaced" ? newKey : "******" + keySuffix;
  const secretDisplayValue =
    secretMode === "replaced" ? newSecret : "******" + secretSuffix;

    //! Handle submit
  const handleSubmitClick = async (data) => {
    const consumerKey = (
      keyMode === "replaced" ? newKey : baseKey + keySuffix
    ).trim();
    const consumerSecret = (
      secretMode === "replaced" ? newSecret : baseSecret + secretSuffix
    ).trim();

    if (!consumerKey || !consumerSecret) {
      toast.error("Consumer key and secret are required");
      return;
    }
    const payload = {
      ...data,
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
    };

    try {
      setLoading(store.id);
      // const response = await updateStoreSettings(store.id, payload);
      const [res] = await Promise.all([
        updateStoreSettings(store.id, payload),
        new Promise((resolve) => setTimeout(resolve, MIN_TOGGLE_LOADING_MS)),
      ]);
      if (res.status === 200) {
        toast.success(res?.data?.message || "Store settings updated successfully");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update store settings";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  //! loading
  if (!store)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );

  //! render
  return (
    <div>
      <form onSubmit={handleSubmit(handleSubmitClick)} className="space-y-6">
        {/* Store Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Store name
          </label>
          <input
            {...register("name")}
            className={`w-full text-sm text-gray-700 border-2 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 transition ${
              errors.name ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Store URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            WooCommerce website URL
          </label>
          <input
            {...register("storeUrl")}
            className={`w-full text-sm text-gray-700 border-2 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 transition ${
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            WooCommerce Consumer Key
          </label>
          <div className="relative flex items-center">
            <input
              type={showKey ? "text" : "password"}
              value={keyDisplayValue}
              onChange={handleKeyChange}
              className="w-full text-sm text-gray-700 border-2 rounded-lg px-3 py-1.5 pr-12 
                         focus:outline-none focus:border-blue-500 transition border-gray-300 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              tabIndex={-1}
              aria-label={showKey ? "Hide consumer key" : "Show consumer key"}
            >
              {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Consumer Secret */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            WooCommerce Consumer Secret
          </label>
          <div className="relative flex items-center">
            <input
              type={showSecret ? "text" : "password"}
              value={secretDisplayValue}
              onChange={handleSecretChange}
              className="w-full text-sm text-gray-700 border-2 rounded-lg px-3 py-1.5 pr-12 
                         focus:outline-none focus:border-blue-500 transition border-gray-300 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="cursor-pointer bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition active:scale-95 shadow"
            disabled={loading === store.id}
          >
            {loading === store.id ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreSettingForm;
