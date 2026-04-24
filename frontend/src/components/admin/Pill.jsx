import React from 'react'

export const Pill = ({ label, active, count, muted, small }) => (
    <div className="relative flex-shrink-0">
      <div
        className={`flex items-center justify-center px-10 py-1 rounded-full border text-sm font-medium cursor-pointer transition-all
          ${active
            ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
            : muted
            ? "bg-white border-gray-200 text-gray-400 hover:border-blue-400"
            : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-500"
          }
          ${small ? "text-xs px-3 py-1" : ""}
        `}
      >
        {label}
      </div>
      {count != null && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );