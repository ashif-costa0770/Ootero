import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { packageInfoSchema } from "../../validations/order.validation";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";

const PackageInfoForm = ({
  order,
  onSubmit,                 
  onAddPackage,
  submitLabel = "Save & Get Quote",
}) => {
  const firstItem = Array.isArray(order?.items) ? order.items[0] : null;
  const dims = firstItem?.product?.dimensions || {};

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(packageInfoSchema),
    defaultValues: {
      consignment: "Choose Package",
      qty: firstItem?.quantity ?? 1,
      weight: firstItem?.product?.weight ?? 0,
      length: dims?.length ?? 0,
      width: dims?.width ?? 0,
      height: dims?.height ?? 0,
      packageReference: order?.wooOrderId ?? order?.id ?? "",
      coverAmount: 100,
      orderNote: order?.note || "",
    },
  });

  useEffect(() => {
    if (!order) return;

    const item = Array.isArray(order?.items) ? order.items[0] : null;
    const itemDims = item?.product?.dimensions || {};

    reset({
      consignment: "Choose Package",
      qty: item?.quantity ?? 1,
      weight: item?.product?.weight ?? 0,
      length: itemDims?.length ?? 0,
      width: itemDims?.width ?? 0,
      height: itemDims?.height ?? 0,
      packageReference: order?.wooOrderId ?? order?.id ?? "",
      coverAmount: 100,
      orderNote: order?.note || "",
    });
  }, [order, reset]);

  const submitHandler = (values) => {
    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">Consignment</label>
          <select {...register("consignment")} className={inputClass}>
            <option value="Choose Package">Choose Package</option>
            <option value="Satchel">Satchel</option>
            <option value="Box">Box</option>
            <option value="Carton">Carton</option>
          </select>
          {errors.consignment && (
            <p className="mt-1 text-xs text-red-500">{errors.consignment.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Qty <span className="text-red-500">*</span></label>
          <input type="number" {...register("qty")} className={inputClass} />
          {errors.qty && (
            <p className="mt-1 text-xs text-red-500">{errors.qty.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Weight (KG) <span className="text-red-500">*</span></label>
          <input type="number" step="0.01" {...register("weight")} className={inputClass} />
          {errors.weight && (
            <p className="mt-1 text-xs text-red-500">{errors.weight.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Length (CM) <span className="text-red-500">*</span></label>
          <input type="number" step="0.01" {...register("length")} className={inputClass} />
          {errors.length && (
            <p className="mt-1 text-xs text-red-500">{errors.length.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Width (CM) <span className="text-red-500">*</span></label>
          <input type="number" step="0.01" {...register("width")} className={inputClass} />
          {errors.width && (
            <p className="mt-1 text-xs text-red-500">{errors.width.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Height (CM) <span className="text-red-500">*</span></label>
          <input type="number" step="0.01" {...register("height")} className={inputClass} />
          {errors.height && (
            <p className="mt-1 text-xs text-red-500">{errors.height.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Package Reference <span className="text-red-500">*</span></label>
          <input {...register("packageReference")} className={inputClass} />
          <p className="mt-1 text-xs text-gray-500">WooCommerce order number</p>
          {errors.packageReference && (
            <p className="mt-1 text-xs text-red-500">
              {errors.packageReference.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Cover Amount <span className="text-red-500">*</span></label>
          <input type="number" {...register("coverAmount")} className={inputClass} />
          {errors.coverAmount && (
            <p className="mt-1 text-xs text-red-500">{errors.coverAmount.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Order Note</label>
          <input {...register("orderNote")} className={inputClass} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onAddPackage?.()}
          className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Add package
        </button>

        <button
          type="submit"
          className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PackageInfoForm;