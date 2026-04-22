import React from "react";

// ── Stat Card Component ──────────────────────────────────
export const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);
