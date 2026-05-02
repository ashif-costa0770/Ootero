import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auspostSettingSchema } from "../../validations/store.validation";
import { toast } from "sonner";
import { getAuspostSettings } from "../../services/store.api";
import { upsertAuspostSettings } from "../../services/store.api";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const inputClass =
  "w-full border-2 border-gray-300 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-md px-3 py-2 text-sm bg-white transition outline-none";

const secretInputClass =
  "w-full text-sm text-gray-700 border-2 rounded-lg px-3 py-1.5 pr-12 focus:outline-none focus:border-blue-500 transition border-gray-300 bg-white";

const AuspostSettingForm = ({ storeId }) => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiPassword, setShowApiPassword] = useState(false);
  const [baseApiKey, setBaseApiKey] = useState("");
  const [baseApiPassword, setBaseApiPassword] = useState("");
  const [apiKeySuffix, setApiKeySuffix] = useState("");
  const [apiPasswordSuffix, setApiPasswordSuffix] = useState("");
  const [apiKeyMode, setApiKeyMode] = useState("masked");
  const [apiPasswordMode, setApiPasswordMode] = useState("masked");
  const [newApiKey, setNewApiKey] = useState("");
  const [newApiPassword, setNewApiPassword] = useState("");
  const MIN_TOGGLE_LOADING_MS = 1000; //for smooth transition

  //! useForm to handle form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(auspostSettingSchema),
    defaultValues: {
      accountNumber: "",
      accountMode: "SANDBOX",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
      countryCode: "",
      companyName: "",
      email: "",
      phone: "",
      combineConsignment: "YES",
      allowPartialDelivery: "YES",
      postBranding: "YES",
      labelLayoutParcel: "A4-4PP",
      labelLayoutExpress: "A4-4PP",
      leftSideSpace: "10",
      topSideSpace: "10",
      streetType: "",
      autoPrint: "YES",
    },
  });

  const syncCredentialsFromPayload = (apiKey, apiPassword) => {
    setBaseApiKey(apiKey || "");
    setBaseApiPassword(apiPassword || "");
    setApiKeySuffix("");
    setApiPasswordSuffix("");
    setApiKeyMode("masked");
    setApiPasswordMode("masked");
    setNewApiKey("");
    setNewApiPassword("");
  };

  const handleApiKeyChange = (e) => {
    const input = e.target.value;
    if (apiKeyMode === "replaced") {
      setNewApiKey(input);
      return;
    }
    if (input.length < 6) {
      setApiKeyMode("replaced");
      setNewApiKey("");
    } else {
      setApiKeySuffix(input.slice(6));
    }
  };

  const handleApiPasswordChange = (e) => {
    const input = e.target.value;
    if (apiPasswordMode === "replaced") {
      setNewApiPassword(input);
      return;
    }
    if (input.length < 6) {
      setApiPasswordMode("replaced");
      setNewApiPassword("");
    } else {
      setApiPasswordSuffix(input.slice(6));
    }
  };

  const apiKeyDisplayValue =
    apiKeyMode === "replaced" ? newApiKey : "******" + apiKeySuffix;
  const apiPasswordDisplayValue =
    apiPasswordMode === "replaced"
      ? newApiPassword
      : "******" + apiPasswordSuffix;

  //! useEffect to fetch auspost settings
  useEffect(() => {
    const fetchAuspostSettings = async () => {
      setLoading(true);
      try {
        const response = await getAuspostSettings(storeId);
        const d = response.data.data || {};
        const { apiKey, apiPassword, ...rest } = d;
        syncCredentialsFromPayload(apiKey, apiPassword);
        reset(rest);
      } catch (error) {
        const message =
          error?.response?.data?.message || "Failed to fetch auspost settings";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuspostSettings();
  }, [storeId, reset]);

  //! handle submit
  const handleSubmitClick = async (data) => {
    const apiKey = (
      apiKeyMode === "replaced" ? newApiKey : baseApiKey + apiKeySuffix
    ).trim();
    const apiPassword = (
      apiPasswordMode === "replaced"
        ? newApiPassword
        : baseApiPassword + apiPasswordSuffix
    ).trim();

    if (!apiKey || !apiPassword) {
      toast.error("API key and API password are required");
      return;
    }

    const payload = { ...data, apiKey, apiPassword };

    try {
      setIsSubmitting(true);
      const [res] = await Promise.all([
        upsertAuspostSettings(storeId, payload),
        new Promise((resolve) => setTimeout(resolve, MIN_TOGGLE_LOADING_MS)),
      ]);
      if (res.status === 200) {
        toast.success(
          res?.data?.message || "Auspost settings updated successfully",
        );
      }
      const saved = res.data.data || {};
      const { apiKey: k, apiPassword: p, ...rest } = saved;
      syncCredentialsFromPayload(k, p);
      reset(rest);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update auspost settings";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  //! loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitClick)} className="space-y-4 mt-2">
      {/* grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {/* account number */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Account Number <span className="text-red-600">*</span>
          </label>
          <input {...register("accountNumber")} className={inputClass} />
          {errors.accountNumber && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.accountNumber.message}
            </p>
          )}
        </div>
        {/* account mode */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Account Mode <span className="text-red-600">*</span>
          </label>
          <select {...register("accountMode")} className={inputClass}>
            <option value="SANDBOX">Sandbox / Test</option>
            <option value="PRODUCTION">Production / Live</option>
          </select>
          {errors.accountMode && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.accountMode.message}
            </p>
          )}
        </div>
        {/* api key */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            API Key <span className="text-red-600">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKeyDisplayValue}
              onChange={handleApiKeyChange}
              autoComplete="new-password"
              className={secretInputClass}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              tabIndex={-1}
              aria-label={showApiKey ? "Hide API key" : "Show API key"}
            >
              {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {/* api password */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            API Password <span className="text-red-600">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type={showApiPassword ? "text" : "password"}
              value={apiPasswordDisplayValue}
              onChange={handleApiPasswordChange}
              autoComplete="new-password"
              className={secretInputClass}
            />
            <button
              type="button"
              onClick={() => setShowApiPassword(!showApiPassword)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              tabIndex={-1}
              aria-label={
                showApiPassword ? "Hide API password" : "Show API password"
              }
            >
              {showApiPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {/* address */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Store Address <span className="text-red-600">*</span>
          </label>
          <input {...register("address")} className={inputClass} />
          {errors.address && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.address.message}
            </p>
          )}
        </div>
        {/* suburb */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Store Suburb <span className="text-red-600">*</span>
          </label>
          <input {...register("suburb")} className={inputClass} />
          {errors.suburb && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.suburb.message}
            </p>
          )}
        </div>
        {/* state */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Store State <span className="text-red-600">*</span>
          </label>
          <input {...register("state")} className={inputClass} />
          {errors.state && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.state.message}
            </p>
          )}
        </div>
        {/* postcode */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Store Postcode <span className="text-red-600">*</span>
          </label>
          <input {...register("postcode")} className={inputClass} />
          {errors.postcode && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.postcode.message}
            </p>
          )}
        </div>
        {/* country code */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Store Country Code <span className="text-red-600">*</span>
          </label>
          <input {...register("countryCode")} className={inputClass} />
          {errors.countryCode && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.countryCode.message}
            </p>
          )}
        </div>
        {/* company name */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-600">*</span>
          </label>
          <input {...register("companyName")} className={inputClass} />
          {errors.companyName && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.companyName.message}
            </p>
          )}
        </div>
        {/* email */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Store Email <span className="text-red-600">*</span>
          </label>
          <input {...register("email")} type="email" className={inputClass} />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>
        {/* phone */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Store Phone <span className="text-red-600">*</span>
          </label>
          <input {...register("phone")} type="tel" className={inputClass} />
          {errors.phone && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>
        {/* combine consignment */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Combine Consignment <span className="text-red-600">*</span>
          </label>
          <select {...register("combineConsignment")} className={inputClass}>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
        </div>
        {/* label layout parcel */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Label layout for parcel post<span className="text-red-600">*</span>
          </label>
          <select {...register("labelLayoutParcel")} className={inputClass}>
            <option value="A4">A4-4PP</option>
            <option value="A5">A4-1PP</option>
            <option value="A5">THERMAL-LABEL-A6-1PP</option>
            <option value="A5">A6-1PP</option>
          </select>
          {errors.labelLayoutParcel && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.labelLayoutParcel.message}
            </p>
          )}
        </div>
        {/* label layout express */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Label layout for express post{" "}
            <span className="text-red-600">*</span>
          </label>
          <select {...register("labelLayoutExpress")} className={inputClass}>
            <option value="A4">A4-4PP</option>
            <option value="A5">A4-1PP</option>
            <option value="A5">THERMAL-LABEL-A6-1PP</option>
            <option value="A5">A6-1PP</option>
          </select>
          {errors.labelLayoutExpress && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.labelLayoutExpress.message}
            </p>
          )}
        </div>
        {/* AUSTRIA POST BRANDING */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Australia Post Branding <span className="text-red-600">*</span>
          </label>
          <select {...register("postBranding")} className={inputClass}>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
          {errors.postBranding && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.postBranding.message}
            </p>
          )}
        </div>
        {/* allow partial */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Allow Partial Delivery <span className="text-red-600">*</span>
          </label>
          <select {...register("allowPartialDelivery")} className={inputClass}>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
          {errors.allowPartialDelivery && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.allowPartialDelivery.message}
            </p>
          )}
        </div>
        {/* label left space */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Label Leftside Space <span className="text-red-600">*</span>
          </label>
          <input {...register("leftSideSpace")} className={inputClass} />
          {errors.leftSideSpace && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.leftSideSpace.message}
            </p>
          )}
        </div>
        {/* label top space */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Label Topside Space <span className="text-red-600">*</span>
          </label>
          <input {...register("topSideSpace")} className={inputClass} />
          {errors.topSideSpace && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.topSideSpace.message}
            </p>
          )}
        </div>
        {/* street type */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Street Type <span className="text-red-500 text-xs">(Comma Separated)</span>
          </label>
          <input {...register("streetType")} className={inputClass} />
          {errors.streetType && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.streetType.message}
            </p>
          )}
        </div>
        {/* auto print */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Auto Print <span className="text-red-600">*</span>
          </label>
          <select {...register("autoPrint")} className={inputClass}>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
          {errors.autoPrint && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.autoPrint.message}
            </p>
          )}
        </div>
      </div>
      {/* footer */}
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition text-white"
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            "Save Settings"
          )}
        </button>
      </div>
    </form>
  );
};

export default AuspostSettingForm;
