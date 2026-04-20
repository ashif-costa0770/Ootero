import React from "react";

const PlatformCard = ({ data, selected, onSelect }) => {
  return (
    <div
      onClick={() => data.available && onSelect(data.id)}
      className={` cursor-pointer
        relative bg-white rounded-2xl p-6 flex items-center justify-center min-h-[130px]
        border-1  transition-all duration-150  shadow-[0_5px_0px_0px_#1a3a3a]  
      `}
    >
      {/* Coming Soon Badge — sits on top border via negative top offset */}
      {!data.available && (
        <span
          className="
          absolute -top-3.5 left-1/2 -translate-x-1/2
          bg-black text-white text-[10px] font-bold
          px-4 py-1 rounded-full tracking-widest whitespace-nowrap uppercase
        "
        >
          Coming Soon
        </span>
      )}

      {/* Selected Checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          ✓
        </div>
      )}

      <img
        src={data.image}
        alt={data.name}
        className={`${data.imageClass || "h-12"} object-contain`}
      />
    </div>
  );
};

export default PlatformCard;
