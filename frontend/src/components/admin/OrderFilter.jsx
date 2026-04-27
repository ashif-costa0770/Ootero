import React from "react";
import { Package, Trash } from "lucide-react";
import { Pill } from "./Pill";
import { useNavigate, useParams } from "react-router-dom";


const DashedH = () => (
  <div className="flex-1 min-w-[16px] border-t border-dashed border-gray-400" />
);

export default function OrderFilter({ statusCounts }) {
  const navigate = useNavigate();
  const { storeId, statusKey } = useParams();

  const goToStatus = (key) => {
    if (!key) {
      navigate(`/admin/woocommerce/${storeId}/orders`);
      return;
    }
    navigate(`/admin/woocommerce/${storeId}/orders/${key}`);
  };
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
      {/* Cancelled — top right */}
      <div className="flex justify-end -mb-2">
        <Pill
          label="Cancelled"
          icon={<Trash size={14}  />}
          active={statusKey === "cancelled"}
          onClick={() => goToStatus("cancelled")}
        />
      </div>

      {/* Main flow row */}
      <div className="flex items-center">
        {/* Order label */}
        <div className="flex items-center gap-2 mr-3 flex-shrink-0">
          <Package size={24} className="text-gray-700" />
          <span className="text-2xl font-semibold text-gray-700">Order</span>
        </div>

        {/* Unpaid */}
        <Pill
          label="Unpaid"
          active={statusKey === "pending"}
          onClick={() => goToStatus("pending")}
        />
        <DashedH />

        {/* Awaiting Process (active) */}
        <Pill
          label="Awaiting Process"
          active={statusKey === "processing"}
          count = {statusCounts?.processing || 0}
          onClick={() => goToStatus("processing")}
        />
        <DashedH />

        {/* Process with Hold/Issue branches */}
        <div className="flex flex-col items-center flex-shrink-0">
          <Pill
            label="Hold"
            active={statusKey === "onhold"}
            onClick={() => goToStatus("onhold")}
          />
         
          <p className="text-sm font-medium text-gray-600 my-2 flex items-center gap-2">Process</p>
         
          <Pill label="Issue" />
        </div>

        <DashedH />
        <Pill label="Pick & Pack" />
        <DashedH />

        <Pill
          label="Shipped"
          active={statusKey === "completed"}
          onClick={() => goToStatus("completed")}
        />
      </div>
    </div>
  );
}
