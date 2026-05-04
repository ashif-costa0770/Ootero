import React, { useEffect, useState } from "react";
import StoreSettingForm from "../../components/form/StoreSettingForm";
import { useParams } from "react-router-dom";
import { getSingleStore } from "../../services/store.api";
import { toast } from "sonner";
import AuspostSettingForm from "../../components/form/AuspostSettingForm";
import ShippingRuleForm from "../../components/form/ShippingRuleForm";
import PackageSettingsForm from "../../components/form/PackageSettingsForm";
import DeclarationTable from "../../components/datatable/DeclarationTable";
import AddDeclarationModel from "../../components/model/AddDeclarationModel";

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
  const [showDeclarationModel, setShowDeclarationModel] = useState(false);
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
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">{activeTab}</h2>
          {activeTab === "Declaration Form" && (
            <button onClick={() => setShowDeclarationModel(true)} className=" mb-4 text-sm bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600">
              Add Declaration Form
            </button>
          )}
        </div>
        <div className="py-6 px-10 bg-white rounded-lg shadow-sm">
          {activeTab === "Store Setting" && (
            <StoreSettingForm store={store} />
          )}
          {activeTab === "Auspost Setting" && (
            <AuspostSettingForm  storeId={storeId}/>
          )}
          {activeTab === "Shipping Rule" && (
            <ShippingRuleForm storeId={storeId} />
          )}
          {activeTab === "Package Settings" && (
            <PackageSettingsForm storeId={storeId} />
          )}
          {activeTab === "Declaration Form" && (
            <DeclarationTable />
          )}
         
        </div>
      </div>
      {showDeclarationModel && (
        <AddDeclarationModel onClose={() => setShowDeclarationModel(false)} />
      )}
    </div>
  );
};

export default StoreSettings;
