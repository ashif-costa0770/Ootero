import React, { useState, useEffect } from "react";
import StoresTable from "../../components/datatable/StoresTable";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddStoreModal from "../../components/model/AddStoreModal";
import { getAllStores } from "../../services/store.api";
import { toast } from "sonner";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  //! Fetch stores
  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await getAllStores();
      console.log(res.data.data);
      setStores(res?.data?.data || []);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch stores";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  //! Update local state when auto sync is toggled
  const handleToggleAutoSyncLocal = (storeId, nextEnabled) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId ? { ...s, orderAutoSyncEnabled: nextEnabled } : s,
      ),
    );
  };

  return (
    <div className="bg-white m-4 p-6 rounded-md shadow-md ">
      {/* header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-5">
        <h2 className="text-xl font-semibold text-gray-700">
          WooCommerce stores
        </h2>
        <button
          className=" bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Add new store
        </button>
      </div>

      {/* table */}
      <div className="mt-6">
        <StoresTable
          stores={stores}
          onToggleAutoSyncLocal={handleToggleAutoSyncLocal}
        />
      </div>

      {/* pagination */}
      <div className="flex justify-between items-center text-sm text-gray-500 mt-3">
        <p>Showing 1 to 1 of 1 entries</p>

        <div className="flex items-center gap-2">
          <button className=" cursor-pointer">
            <ChevronLeft size={20} />
          </button>
          <button className=" cursor-pointer bg-gray-200 text-gray-500 font-medium px-2.5 py-1 rounded-md">
            1
          </button>
          <button className=" cursor-pointer">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* add store modal */}
      <AddStoreModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default Stores;
