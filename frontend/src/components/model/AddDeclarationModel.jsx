import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { declarationSchema } from "../../validations/store.validation";
import ItemFields from "./ItemFields";
import { BadgeAlert, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getAuspostDeclarations,
  updateAuspostDeclarations,
} from "../../services/store.api";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors";
const selectClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors";

export default function AddDeclarationModel({ onClose, storeId, onSaved }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(declarationSchema),
    defaultValues: {
      hasCommercialValue: false,
      items: [
        {
          description: "",
          quantity: 1,
          unitValue: 0,
          weight: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  //! Fetch declaration
  useEffect(() => {
    const fetchDeclaration = async () => {
      try {
        setLoading(true);
        const response = await getAuspostDeclarations(storeId);
        const data = response.data.data || null;
        reset(data);
      } catch (error) {
        const message =
          error?.response?.data?.message || "Failed to fetch declaration";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchDeclaration();
  }, [storeId]);

  //! Handle submit
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await updateAuspostDeclarations(storeId, data);
      if (response.status === 200) {
        toast.success(
          response?.data?.message || "Declaration saved successfully",
        );
        reset();
        onClose();
        onSaved();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to save declaration";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  //! Loader
  if (loading)
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl px-6 py-5 relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight px-6">
            Add Declaration Form
          </h2>
          <button
            className="cursor-pointer rounded-full p-2 mr-2 hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
        {/* note */}
        <div className="text-sm text-gray-500 mb-4 mt-4 px-6">
          <p>
            {" "}
            <BadgeAlert className="w-5 h-5 inline-block mr-1 text-blue-500" />{" "}
            This declaration is for your parcel, each parcel may contain
            multiple items.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Top Fields */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Item Description <span className="text-red-500">*</span>
              </label>
              <input
                {...register("itemDescription")}
                placeholder="Enter item description"
                className={inputClass}
              />
              {errors.itemDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.itemDescription.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Why are you sending this parcel?{" "}
                <span className="text-red-500">*</span>
              </label>
              <select {...register("reason")} className={selectClass}>
                <option value="GIFT">Gift</option>
                <option value="SALE">Sale</option>
              </select>
              {errors.reason && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.reason.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Import Reference Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register("importRef")}
                placeholder="Enter import reference"
                className={inputClass}
              />
              {errors.importRef && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.importRef.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Description Of Other <span className="text-red-500">*</span>
              </label>
              <input
                {...register("descriptionOfOther")}
                placeholder="Enter description of other"
                className={inputClass}
              />
              {errors.descriptionOfOther && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.descriptionOfOther.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Item Reference<span className="text-red-500">*</span>
              </label>
              <input
                {...register("itemReference")}
                placeholder="Enter item reference"
                className={inputClass}
              />
              {errors.itemReference && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.itemReference.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Item Length <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register("itemLength", { valueAsNumber: true })}
                placeholder="Enter length"
                className={inputClass}
              />
              {errors.itemLength && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.itemLength.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Item Height <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register("itemHeight", { valueAsNumber: true })}
                placeholder="Enter height"
                className={inputClass}
              />
              {errors.itemHeight && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.itemHeight.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Item Weight <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register("itemWeight", { valueAsNumber: true })}
                placeholder="Enter weight"
                className={inputClass}
              />
              {errors.itemWeight && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.itemWeight.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Item Width <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register("itemWidth", { valueAsNumber: true })}
                placeholder="Enter width"
                className={inputClass}
              />
              {errors.itemWidth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.itemWidth.message}
                </p>
              )}
            </div>
            <div className=" mt-8">
              {/* Checkbox */}
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("hasCommercialValue")} />
                <span className="cursor-pointer text-sm font-medium text-gray-700">
                  Has commercial value
                </span>
              </label>
              {errors.hasCommercialValue && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.hasCommercialValue.message}
                </p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="mt-18">
            {fields.map((field, index) => (
              <ItemFields
                key={field.id}
                index={index}
                register={register}
                errors={errors}
                remove={index > 0 ? remove : undefined}
              />
            ))}
            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() =>
                  append({
                    description: "",
                    quantity: 1,
                    unitValue: 0,
                    weight: 0,
                  })
                }
                className="mt-2 px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
              >
                + Add Another Item
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className=" mt-2 px-6 h-9 flex items-center justify-center text-sm font-semibold bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
