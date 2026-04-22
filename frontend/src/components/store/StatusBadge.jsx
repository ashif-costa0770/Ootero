import React from 'react'

// ── Status Badge ─────────────────────────────────────────
export const StatusBadge = ({ label, count, color }) => (
    <div className="flex items-center justify-between py-2 px-4 rounded-xl bg-gray-50">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="text-sm font-medium text-gray-600 capitalize">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-800">{count}</span>
    </div>
  );
