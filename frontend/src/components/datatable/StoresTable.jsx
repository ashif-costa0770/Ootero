import {
  ArrowRight,
  Loader,
  Pause,
  RefreshCw,
  Settings,
  User,
  Play,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { testStoreConnection } from "../../services/store.api";
import { toggleOrderAutoSync } from "../../services/order.api";
import { triggerOrderSync } from "../../services/order.api";
import { useNavigate } from "react-router-dom";

const StoresTable = ({ stores, onToggleAutoSyncLocal }) => {
  const [testConnectionLoadingId, setTestConnectionLoadingId] = useState(null);
  const [syncToggleLoadingId, setSyncToggleLoadingId] = useState(null);
  const [orderSyncLoadingId, setOrderSyncLoadingId] = useState(null);
  const MIN_TOGGLE_LOADING_MS = 1200; //for smooth transition
  const navigate = useNavigate();
  const statusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-500";
      case "INACTIVE":
        return "text-red-500";
      case "ERROR":
        return "text-yellow-500";
      case "PENDING_VERIFICATION":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  //! Test store connection
  const handleTestConnection = async (storeId) => {
    try {
      setTestConnectionLoadingId(storeId);
      const res = await testStoreConnection(storeId);
      toast.success(
        res?.data?.message || "Store connection tested successfully",
      );
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to test store connection";
      toast.error(message);
    } finally {
      setTestConnectionLoadingId(null);
    }
  };

  //! Enable/disable order auto sync
  const handleToggleAutoSync = async (store) => {
    try {
      setSyncToggleLoadingId(store.id);
      const nextEnabled = !store.orderAutoSyncEnabled;
      const [res] = await Promise.all([
        toggleOrderAutoSync(store.id, nextEnabled),
        new Promise((resolve) => setTimeout(resolve, MIN_TOGGLE_LOADING_MS)),
      ]);

      onToggleAutoSyncLocal?.(store.id, nextEnabled); // update local state

      toast.success(
        res?.data?.message ||
          (nextEnabled
            ? "Order auto-sync resumed for this store"
            : "Order auto-sync paused for this store"),
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to update order auto-sync setting";
      toast.error(message);
    } finally {
      setSyncToggleLoadingId(null);
    }
  };

  //! Sync orders from WooCommerce
  const handleOrdersSync = async (storeId) => {
    try {
      setOrderSyncLoadingId(storeId);
      const res = await triggerOrderSync(storeId);
      toast.success(res?.data?.message || "Orders synced successfully");
      // await fetchStores(); // refresh table immediately
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to sync orders";
      toast.error(message);
    } finally {
      setOrderSyncLoadingId(null);
    }
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-gray-600 text-sm text-left">
          <tr>
            <th className="p-3  font-semibold">#</th>
            <th className="p-3 font-semibold">STORE NAME</th>
            <th className="p-3 font-semibold">STATUS</th>
            <th className="p-3 font-semibold">SOURCE TYPE</th>
            <th className="p-3 font-semibold">ASSIGNED TO</th>
            <th className="p-3 font-semibold">DATE ADDED</th>
            <th className="p-3 font-semibold">OPTIONS</th>
          </tr>
        </thead>
        {/* table body */}
        <tbody className="text-gray-700 text-sm">
          {stores.map((store, index) => (
            <tr key={store.id}>
              <td className="p-3">{index + 1}</td>
              <td
                className=" cursor-pointer p-3 text-blue-500 font-medium"
                onClick={() => (window.location.href = `${store.storeUrl}`)}
              >
                {store.name}
              </td>
              <td className={`p-3 ${statusClass(store.status)} font-medium`}>
                {store.status}
              </td>
              <td className="p-3 text-gray-500">{store.platform}</td>
              <td className="p-3 text-gray-500 cursor-pointer">
                <div className="ml-6 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center relative group">
                  <span
                      className="pointer-events-none absolute bottom-full z-70 mb-1 left-1/2 -translate-x-1/2 
                                 whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      {`${store.user.firstName} ${store.user.lastName}`}
                    </span>
                  <User className="w-4 h-4 text-gray-500" />
                 
                </div>
                
              </td>
              <td className="p-3 text-gray-500">
                {new Date(store.createdAt).toISOString().slice(0, 10) +
                  " " +
                  new Date(store.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
              </td>

              <td className="p-3">
                <div className="flex items-center gap-2">
                  {/* test connection */}
                  <button
                    className="bg-green-500 p-1.5 rounded text-white cursor-pointer flex items-center gap-2 group relative"
                    onClick={() => handleTestConnection(store.id)}
                    disabled={testConnectionLoadingId === store.id}
                  >
                    {testConnectionLoadingId === store.id ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <ArrowRight size={16} />
                    )}
                   
                    <span
                      className="pointer-events-none absolute bottom-full z-70 mb-1 left-1/2 -translate-x-1/2 
                                 whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      Test connection
                    </span>
                  </button>

                  {/* toggle auto sync */}
                  <button
                    className="bg-yellow-500 p-1.5 rounded text-white cursor-pointer group relative"
                    onClick={() => handleToggleAutoSync(store)}
                    disabled={syncToggleLoadingId === store.id}
                  >
                    {syncToggleLoadingId === store.id ? (
                      <Loader size={16} className="animate-spin" />
                    ) : store.orderAutoSyncEnabled ? (
                      <Pause
                        size={16}
                        className="animate fill-white stroke-none"
                      />
                    ) : (
                      <Play
                        size={16}
                        className="animate fill-white stroke-none"
                      />
                    )}
                    {/* title Order auto sync */}
                    <span
                      className="pointer-events-none absolute bottom-full z-70 mb-1 left-1/2 -translate-x-1/2 
                                 whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      {store.orderAutoSyncEnabled
                        ? "Pause auto sync"
                        : "Resume auto sync"}
                    </span>
                  </button>

                  {/* sync orders */}
                  <button
                    className="bg-blue-500 p-1.5 rounded text-white cursor-pointer group relative"
                    onClick={() => handleOrdersSync(store.id)}
                    disabled={orderSyncLoadingId === store.id}
                  >
                    <RefreshCw
                      size={16}
                      className={`${orderSyncLoadingId === store.id ? "animate-spin" : ""}`}
                    />

                    {/* title Check updates */}
                    <span
                      className="pointer-events-none absolute bottom-full z-70 mb-1 left-1/2 -translate-x-1/2 
                                 whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      Check updates
                    </span>
                  </button>

                  {/* store settings */}
                  <button
                    className="bg-indigo-500 p-1.5 rounded text-white cursor-pointer group relative"
                    onClick={() =>
                      navigate(`/admin/stores/${store.id}/settings`)
                    }
                  >
                    <Settings size={16} />
                    {/* title Store settings */}
                    <span
                      className="pointer-events-none absolute bottom-full z-70 mb-1 left-1/2 -translate-x-1/2 
                                 whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      Store settings
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoresTable;
