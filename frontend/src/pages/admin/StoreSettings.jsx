import React, { useEffect, useState } from "react";
import StoreSettingForm from "../../components/form/StoreSettingForm";
import { useParams } from "react-router-dom";
import { getSingleStore } from "../../services/store.api";
import { toast } from "sonner";

const tabs = [
  "Store Setting",
  "Auspost Setting",
  "Shipping Rule",
  "Package Settings",
  "Declaration Form",
];

const StoreSettings = () => {
  const [activeTab, setActiveTab] = useState("Store Setting");
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);

  //! Fetch store
  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const response = await getSingleStore(storeId);
        setStore(response.data.data);
      } catch (error) {
        const message =
          error?.response?.data?.message || "Failed to fetch store";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [storeId]);

  return (
    <div className="p-4">
      {/* tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex justify-between px-12 pt-6 text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 cursor-pointer text-base ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* heading and form */}
      <div className="mt-12 ">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{activeTab}</h2>
        <div className="py-6 px-10 bg-white rounded-lg shadow-sm">
          {activeTab === "Store Setting" && (
            <StoreSettingForm store={store} />
          )}

          {/* Later you plug other tabs */}
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;
