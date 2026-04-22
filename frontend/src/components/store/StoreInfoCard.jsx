import React from "react";

export const StoreInfoCard = ({ store }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Store Information
      </h2>
      <div className="flex flex-col gap-4">
        {[
          { label: "Store Name", value: store.name },
          { label: "Store URL", value: store.url },
          { label: "Store ID", value: store.id },
          { label: "Store Platform", value: store.platform.charAt(0).toUpperCase() + store.platform.slice(1) },
          {
            label: "Connected",
            value: new Date(store.connectedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0"
          >
            <span className="text-gray-500">{label}</span>
            <span className="text-gray-700 font-medium text-right max-w-[60%] truncate">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
