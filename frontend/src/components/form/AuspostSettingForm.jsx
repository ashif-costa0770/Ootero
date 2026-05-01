import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auspostSettingSchema } from "../../validations/store.validation";
import { toast } from "sonner";

const inputClass =
  "w-full border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-md px-3 py-2 text-sm bg-white transition outline-none";
const AuspostSettingForm = () => {
  //! useForm to handle form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(auspostSettingSchema),
  });

  //! handle submit
  const handleSubmitClick = (data) => {
    console.log(data);
    toast.success("Auspost settings updated successfully");
    reset();
  };

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
            <option value="sandbox">Sandbox / Test</option>
            <option value="production">Production / Live</option>
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
          <input {...register("apiKey")} className={inputClass} />
          {errors.apiKey && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.apiKey.message}
            </p>
          )}
        </div>
        {/* api password */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            API Password <span className="text-red-600">*</span>
          </label>
          <input
            {...register("apiPassword")}
            type="password"
            autoComplete="new-password"
            className={inputClass}
          />
          {errors.apiPassword && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.apiPassword.message}
            </p>
          )}
        </div>
        {/* address */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Address <span className="text-red-600">*</span>
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
            Suburb <span className="text-red-600">*</span>
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
            State <span className="text-red-600">*</span>
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
            Postcode <span className="text-red-600">*</span>
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
            Country Code <span className="text-red-600">*</span>
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
            Email <span className="text-red-600">*</span>
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
            Phone <span className="text-red-600">*</span>
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
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        {/* label layout parcel */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Label Layout Parcel <span className="text-red-600">*</span>
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
            Label Layout Express <span className="text-red-600">*</span>
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
            Austria Post Branding <span className="text-red-600">*</span>
          </label>
          <select {...register("austriaPostBranding")} className={inputClass}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.austriaPostBranding && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.austriaPostBranding.message}
            </p>
          )}
        </div>
        {/* allow partial */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Allow Partial Delivery <span className="text-red-600">*</span>
          </label>
          <select {...register("allowPartial")} className={inputClass}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.allowPartial && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.allowPartial.message}
            </p>
          )}
        </div>
        {/* label left space */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Label Left Space <span className="text-red-600">*</span>
          </label>
          <input {...register("labelLeftSpace")} className={inputClass} />
          {errors.labelLeftSpace && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.labelLeftSpace.message}
            </p>
          )}
        </div>
        {/* label top space */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Label Top Space <span className="text-red-600">*</span>
          </label>
          <input {...register("labelTopSpace")} className={inputClass} />
          {errors.labelTopSpace && (
            <p className="text-red-600 text-xs mt-1 font-medium">
              {errors.labelTopSpace.message}
            </p>
          )}
        </div>
        {/* street type */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium text-gray-700 mb-1">
            Street Type <span className="text-red-600">(Comma Separated)</span>
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
            <option value="yes">Yes</option>
            <option value="no">No</option>
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
          className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition text-white"
        >
          Save Settings
        </button>
      </div>
    </form>
  );
};

export default AuspostSettingForm;
