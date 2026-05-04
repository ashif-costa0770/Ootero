import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { packageSettingSchema } from "../../validations/store.validation";
import { getPackageSettings, updatePackageSettings } from "../../services/store.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
const MIN_TOGGLE_LOADING_MS = 1100; //for smooth transition

const PackageSettingsForm = ({ storeId }) => {
  const [loading, setLoading] = useState(false); 
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(packageSettingSchema),
    defaultValues: {
      packages: [
        {
          name: "",
          weight: "",
          width: "",
          length: "",
          height: "",
          isDefault: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "packages",
  });

  const packages = watch("packages"); //

  //! Fetch package settings
   useEffect(() => {
    const fetchPackageSettings = async () => {
      try {
        setLoading(true);
        const response = await getPackageSettings(storeId);
        const data = response.data.data;
        console.log("PACKAGE SETTINGS:", data);
        reset({ packages: data });
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Failed to fetch package settings";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchPackageSettings();
  }, [storeId, reset]);

  // ✅ Handle default selection (only one true)
  const handleDefaultChange = (index) => {
    packages.forEach((_, i) => {
      setValue(`packages.${i}.isDefault`, i === index);
    });
  };

   //! Handle submit
   const onSubmit = async (data) => {
    try {
      setLoading(true);
      const [response] = await Promise.all([
        updatePackageSettings(storeId, data),
        new Promise((resolve) => setTimeout(resolve, MIN_TOGGLE_LOADING_MS)),
      ]);
      if (response.status === 200) {
        toast.success(
          response?.data?.message ||
            "Package settings updated successfully",
        );
      }
      const saved = response.data.data || {};
      console.log("PACKAGE SETTINGS SAVED:", saved);
      reset(data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to update package settings";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  //! Handle remove
  const handleRemovePackage = async (index) => {

    const packages = getValues("packages") ?? [];
    const updated = packages.filter((_, i) => i !== index);
    if (updated.length === 0) {
      toast.error("At least one package is required.");
      return;
    }
    try {
      setLoading(true);
      await updatePackageSettings(storeId, { packages: updated });
      reset({ packages: updated });
      toast.success("Package removed");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to remove package";
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
              <th className="border border-[#e0e0e0] bg-white px-4 py-3  text-left font-semibold text-gray-700 w-[16%]">
                Package Name
              </th>
              <th className="border border-[#e0e0e0] bg-white px-4 py-3 text-left font-semibold text-gray-700 w-[16%]">
                Weight <span className="text-xs text-red-500">(kg)</span>
              </th>
              <th className="border border-[#e0e0e0] bg-white px-4 py-3 text-left font-semibold text-gray-700 w-[16%]">
                Width <span className="text-xs text-red-500">(cm)</span>
              </th>
              <th className="border border-[#e0e0e0] bg-white px-4 py-3 text-left font-semibold text-gray-700 w-[16%]">
                Length <span className="text-xs text-red-500">(cm)</span>
              </th>
              <th className="border border-[#e0e0e0] bg-white px-4 py-3 text-left font-semibold text-gray-700 w-[16%]">
                Height <span className="text-xs text-red-500">(cm)</span>
              </th>
              <th className="border border-[#e0e0e0] bg-white px-4 py-3 text-center font-semibold text-gray-700 w-[16%]">
                Is Default?
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
                    {...register(`packages.${index}.name`)}
                    placeholder="Enter Package Name"
                    className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  {errors.packages?.[index]?.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.packages[index].name.message}
                    </p>
                  )}
                </td>
                <td className="border border-[#e0e0e0] align-top px-4 py-3 text-gray-600">
                  <input
                    {...register(`packages.${index}.weight`, {
                      valueAsNumber: true,
                    })}
                    placeholder="Enter Weight"
                    className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.packages?.[index]?.weight && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.packages[index].weight.message}
                    </p>
                  )}
                </td>
                <td className="border border-[#e0e0e0] align-top px-4 py-3 text-gray-600">
                  <input
                    {...register(`packages.${index}.width`, {
                      valueAsNumber: true,
                    })}
                    placeholder="Enter Width"
                    className="w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.packages?.[index]?.width && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.packages[index].width.message}
                    </p>
                  )}
                </td>
                <td className="border border-[#e0e0e0] align-top px-4 py-3 text-gray-600">
                  <input
                    {...register(`packages.${index}.length`, {
                      valueAsNumber: true,
                    })}
                    placeholder="Enter Length"
                    className="w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.packages?.[index]?.length && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.packages[index].length.message}
                    </p>
                  )}
                </td>
                <td className="border border-[#e0e0e0] align-top px-4 py-3 text-gray-600">
                  <input
                    {...register(`packages.${index}.height`, {
                      valueAsNumber: true,
                    })}
                    placeholder="Enter Height"
                    className="w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.packages?.[index]?.height && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.packages[index].height.message}
                    </p>
                  )}
                </td>
                <td className="border border-[#e0e0e0] align-top px-4 py-3 text-center text-gray-600">
                  <label className="inline-flex items-center justify-center gap-2 cursor-pointer w-full">
                    <input
                      type="radio"
                      checked={packages[index]?.isDefault || false}
                      onChange={() => handleDefaultChange(index)}
                      className="h-5 w-5 appearance-none rounded-full border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition duration-150 cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </td>

                <td className="border border-[#e0e0e0] px-4 py-3 text-center align-middle">
                  <button
                    type="button"
                    onClick={() => handleRemovePackage(index)}
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
              name: "",
              weight: "",
              width: "",
              length: "",
              height: "",
              isDefault: false,
            })
          }
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Add Row
        </button>
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </button>
      </div>
    </form>
  );
};

export default PackageSettingsForm;
