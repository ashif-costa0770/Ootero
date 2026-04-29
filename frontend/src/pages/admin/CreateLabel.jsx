import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import googleMapIcon from "../../assets/g_mp_c.svg";
import { getOrderById, updatePackageInfo } from "../../services/order.api";
import {
  MapPin,
  Pencil,
  User,
  Phone,
  Package,
  Home,
  FileText,
  Truck,
  ChevronDown,
} from "lucide-react";
import ShipToForm from "../../components/form/ShipToForm";
import FromAddressForm from "../../components/form/FromAddressForm";
import PackageInfoForm from "../../components/form/PackageInfoForm";
import { toast } from "sonner";

const money = (value) => {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
};

const joinAddress = (order) => {
  const parts = [
    order?.shippingAddress1,
    order?.shippingAddress2,
    order?.shippingCity,
    order?.shippingState,
    order?.shippingPostcode,
    order?.shippingCountry,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "-";
};

export default function CreateLabel() {
  const { storeId, orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showShipToForm, setShowShipToForm] = useState(false);
  const [showFromAddressForm, setShowFromAddressForm] = useState(false);
  const [showPackageInfoForm, setShowPackageInfoForm] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!storeId || !orderId) {
      setError("Missing store or order details.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await getOrderById(storeId, orderId);
      setOrder(res?.data?.data || null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to fetch order details.",
      );
    } finally {
      setLoading(false);
    }
  }, [storeId, orderId]);

  const handlePackageInfoSubmit = async (values) => {
    try {
      const response = await updatePackageInfo(orderId, values);
      const message =
        response?.data?.message || "Package info updated successfully";
      toast.success(message);
      setShowPackageInfoForm(false);
      await fetchOrder();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to update package info.";
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const items = Array.isArray(order?.items) ? order.items : [];
  const firstItem = items[0] || null;
  const firstItemDimensions =
    firstItem?.product?.dimensions || firstItem?.dimensions || {};

  const displayName = useMemo(() => {
    if (order?.shippingFirstName && order?.shippingLastName)
      return `${order.shippingFirstName} ${order.shippingLastName}`;
    if (order?.shippingFirstName) return order.shippingFirstName;
    if (order?.shippingLastName) return order.shippingLastName;
    return "N/A";
  }, [order]);

  const shippingAddress = joinAddress(order);
  const shippingPhone = order?.shippingPhone || order?.customerPhone || "-";
  const shippingMethod = order?.shippingMethod || "-";
  const shippingCost = Number(order?.shippingTotal ?? 0);
  const subtotal = Math.max(Number(order?.totalAmount ?? 0) - shippingCost, 0);
  const total = Number(order?.totalAmount ?? 0);
  const currency = order?.currency || "AUD";

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-600">Loading label details...</div>
    );
  }

  if (error) {
    return <div className="p-4 text-sm text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="p-4 text-sm text-gray-600">Order not found.</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h1 className="text-3xl font-semibold text-gray-800">Create Label</h1>
        <div className="mt-4 space-y-1 text-sm text-gray-600">
          <p>ID: {order.id}</p>
          <p>
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "Date not available"}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            {/* From Address */}
            <section className="border border-gray-200 rounded-lg bg-white">
              <div className="px-4 py-4  flex items-center justify-between bg-gray-100">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-gray-800" />
                  <h2 className="text-lg font-semibold text-gray-700">
                    {" "}
                    From Address
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="cursor-pointer bg-blue-500 text-white px-3 py-1.5 text-sm font-medium rounded-md">
                    Address Valid
                  </button>
                  <button
                    className="cursor-pointer text-blue-500 px-3 rounded-md"
                    onClick={() => setShowFromAddressForm(!showFromAddressForm)}
                  >
                    {showFromAddressForm ? (
                      <ChevronDown size={20} />
                    ) : (
                      <Pencil size={20} />
                    )}
                  </button>
                </div>
              </div>

              {showFromAddressForm ? (
                <div className="px-4 py-4">
                  <FromAddressForm
                    order={order}
                    submitLabel="Update"
                    onSuccess={() => setShowFromAddressForm(false)}
                  />
                </div>
              ) : (
                <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
                  <div className=" flex items-center gap-2">
                    {" "}
                    <User size={18} className="text-gray-800" />{" "}
                    <span className="text-gray-700">{displayName}</span>
                  </div>
                  <div className=" flex items-center gap-2">
                    {" "}
                    <Home size={28} className="text-gray-800" />{" "}
                    <span className="text-gray-700">{shippingAddress}</span>
                  </div>
                  <div className=" flex items-center gap-2 ms-11">
                    {" "}
                    <Phone size={18} className="text-gray-800" />{" "}
                    <span className="text-gray-700">{shippingPhone}</span>
                  </div>
                </div>
              )}
            </section>

            {/* Ship To */}
            <section className="border border-gray-200 rounded-lg bg-white">
              <div className="px-4 py-4  flex items-center justify-between bg-gray-100">
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-gray-800" />
                  <h2 className="text-lg font-semibold text-gray-700">
                    {" "}
                    Ship To
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="cursor-pointer bg-blue-500 text-white px-3 py-1.5 text-sm font-medium rounded-md">
                    Address Valid
                  </button>
                  <button
                    className="cursor-pointer text-blue-500 px-3 rounded-md"
                    onClick={() => setShowShipToForm(!showShipToForm)}
                  >
                    {showShipToForm ? (
                      <ChevronDown size={20} />
                    ) : (
                      <Pencil size={20} />
                    )}
                  </button>
                </div>
              </div>
              {showShipToForm ? (
                <div className="px-4 py-4">
                  <ShipToForm
                    order={order}
                    onSuccess={async () => {
                      await fetchOrder();
                      setShowShipToForm(false);
                    }}
                    submitLabel="Update"
                  />
                </div>
              ) : (
                <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
                  <div className=" flex items-center gap-2">
                    <User size={18} className="text-gray-800" />{" "}
                    <span className="text-gray-700">{displayName}</span>
                  </div>
                  <div className=" flex items-center gap-2">
                    <Home size={24} className="text-gray-800" />{" "}
                    <span className="text-gray-700">{shippingAddress}</span>
                  </div>

                  <div className=" flex items-center gap-2">
                    <img
                      src={googleMapIcon}
                      onClick={() => {
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${shippingAddress}`,
                          "_blank",
                        );
                      }}
                      alt="Google Map"
                      className="cursor-pointer text-gray-800 w-5 h-5 me-4"
                    />
                    <Phone size={18} className="text-gray-800" />{" "}
                    <span className="text-gray-700">{shippingPhone}</span>
                  </div>
                </div>
              )}
            </section>

            {/* Package Info */}
            <section className="border border-gray-200 rounded-lg bg-white">
              <div className="px-4 py-4  flex items-center justify-between bg-gray-100">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-gray-800" />
                  <h2 className="text-lg font-semibold text-gray-700">
                    {" "}
                    Package Info
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="cursor-pointer bg-blue-500 text-white px-3 py-1.5 text-sm font-medium rounded-md">
                    Package Valid
                  </button>
                  <button
                    className="cursor-pointer text-blue-500 px-3 rounded-md"
                    onClick={() => setShowPackageInfoForm(!showPackageInfoForm)}
                  >
                    {showPackageInfoForm ? (
                      <ChevronDown size={20} />
                    ) : (
                      <Pencil size={20} />
                    )}
                  </button>
                </div>
              </div>

              {showPackageInfoForm ? (
                <div className="px-4 py-4">
                  <PackageInfoForm
                    order={order}
                    submitLabel="Update"
                    onSubmit={handlePackageInfoSubmit}
                  />
                </div>
              ) : (
                <div className="px-4 py-4 text-sm text-gray-700 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        Qty: {firstItem?.quantity ?? "-"}
                      </p>
                    </div>
                    <div className="-ms-4">
                      <p className="text-sm text-gray-600">
                        Weight:{" "}
                        {firstItem?.product?.weight ?? firstItem?.weight ?? "-"}
                      </p>
                    </div>
                    <div className="-ms-8">
                      <p className="text-sm text-gray-600">
                        (L x W x H): {firstItemDimensions?.length ?? "-"} x{" "}
                        {firstItemDimensions?.width ?? "-"} x{" "}
                        {firstItemDimensions?.height ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Reference: {order?.wooOrderId ?? order?.id ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
          {/* Order Info */}
          <div className="space-y-5">
            <section className="border border-gray-200 rounded-lg bg-white">
              <div className="px-4 py-4 flex items-center justify-between bg-gray-100">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  <FileText size={20} className="text-gray-800" />
                  <span className="ml-2">Order Info</span>
                </div>
              </div>

              <div className="px-4 py-4">
                <table className="min-w-full divide-y border border-gray-200  divide-gray-200  overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 border-r border-gray-200 text-sm font-semibold text-left text-gray-600">
                        SKU
                      </th>
                      <th className="px-3 py-2 border-r border-gray-200 text-sm font-semibold text-left text-gray-600">
                        Item
                      </th>
                      <th className="px-3 py-2 border-r border-gray-200 text-sm font-semibold text-left text-gray-600">
                        Price
                      </th>
                      <th className="px-3 py-2 border-r border-gray-200 text-sm font-semibold text-left text-gray-600">
                        Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {Array.isArray(items) && items.length > 0 ? (
                      items.map((item, index) => (
                        <tr key={item && item.id ? item.id : `item-${index}`}>
                          <td className="px-3 py-3 border-r border-gray-200 text-[13px] text-gray-700">
                            {item?.sku ?? "-"}
                          </td>
                          <td className="px-3 py-3 border-r border-gray-200 text-[13px] text-gray-700">
                            {item?.name ?? "-"}
                          </td>
                          <td className="px-3 py-3 border-r border-gray-200 text-[13px] text-gray-700">
                            ${money(item?.price)}
                          </td>
                          <td className="px-3 py-3 border-r border-gray-200 text-[13px] text-gray-700">
                            {item?.quantity ?? "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-sm text-center text-gray-500"
                        >
                          No items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <table
                  className="mt-4 w-full text-sm border border-gray-200  "
                  style={{ borderCollapse: "collapse" }}
                >
                  <tbody>
                    <tr>
                      <td
                        className="py-3 px-4 text-gray-500 font-normal align-top border-r border-b border-gray-200"
                        style={{ width: "50%" }}
                      >
                        Sub Total
                      </td>
                      <td className="py-3 px-4 text-right font-normal text-gray-700 text-sm align-top border-b border-gray-200">
                        {currency} {money(subtotal)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-500 font-normal align-top border-r border-b border-gray-200">
                        Shipping
                        <br />
                        Cost:
                      </td>
                      <td className="py-3 px-4 text-right font-normal align-top border-b border-gray-200">
                        <span className="text-gray-700 text-sm">
                          {currency} {money(shippingCost)}
                        </span>
                        {shippingMethod && (
                          <span className="ml-2 align-middle text-xs font-semibold text-blue-900 whitespace-nowrap">
                            [<span className="font-bold">{shippingMethod}</span>
                            ]
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-gray-900 align-top border-r border-gray-200">
                        Total
                      </td>
                      <td className="py-3 px-4 text-right font-bold align-top text-gray-900">
                        {currency} {money(total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="border border-gray-200 rounded-lg bg-white">
              <div className="px-4 py-4 flex items-center justify-between bg-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-md font-semibold text-gray-700">
                    <Truck size={24} className="text-gray-800" />
                    <span className="ml-2">Shipping Summary</span>
                  </div>
                  <button className="cursor-pointer text-blue-500 px-3 rounded-md text-sm">
                    {/* Show Package */}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <table className="w-full text-sm text-gray-700 border border-gray-200 divide-y divide-gray-200 overflow-hidden">
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 text-gray-500 font-normal align-top border-r border-b border-gray-200">
                        Ship From
                      </td>
                      <td className="py-3 px-4 text-right font-normal text-gray-700 text-[13px] align-top border-b border-gray-200">
                        {shippingAddress}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-500 font-normal align-top border-r border-b border-gray-200">
                        Ship To
                      </td>
                      <td className="py-3 px-4 text-right font-normal text-gray-700 text-[13px] align-top border-b border-gray-200">
                        {shippingAddress}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-500 font-normal align-top border-r border-b border-gray-200">
                        Carrier
                      </td>
                      <td className="py-3 px-4 text-right font-normal text-gray-700 text-[13px] align-top border-b border-gray-200">
                        {shippingMethod}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-500 font-normal align-top border-r border-b border-gray-200">
                        Shipping Cost
                      </td>
                      <td className="py-3 px-4 text-right font-normal text-gray-700 text-[13px] align-top border-b border-gray-200">
                        {currency} {money(shippingCost)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-gray-900 align-top border-r border-gray-200 border-t">
                        Total Cost
                      </td>
                      <td className="py-3 px-4 text-right font-bold align-top text-gray-900 border-t">
                        {currency} {money(total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
